<?php

namespace App\Http\Controllers;

use App\Contracts\ScansFile;
use App\Jobs\AddPageNumbersJob;
use App\Jobs\CompressPdfJob;
use App\Jobs\ImageToPdfJob;
use App\Jobs\MergePdfJob;
use App\Jobs\OrganizePdfJob;
use App\Jobs\PdfToImageJob;
use App\Jobs\ProtectPdfJob;
use App\Jobs\SplitPdfJob;
use App\Jobs\WatermarkPdfJob;
use App\Models\AbuseLog;
use App\Models\IpBlocklist;
use App\Models\PdfJob;
use App\Models\Setting;
use App\Services\UsageQuotaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PdfJobController extends Controller
{
    private const JOB_MAP = [
        'merge'        => MergePdfJob::class,
        'split'        => SplitPdfJob::class,
        'compress'     => CompressPdfJob::class,
        'organize'     => OrganizePdfJob::class,
        'image-to-pdf' => ImageToPdfJob::class,
        'pdf-to-image' => PdfToImageJob::class,
        'watermark'    => WatermarkPdfJob::class,
        'page-numbers' => AddPageNumbersJob::class,
        'protect'      => ProtectPdfJob::class,
    ];

    public function __construct(
        private readonly ScansFile $scanner,
        private readonly UsageQuotaService $quota,
    ) {}

    public function store(Request $request): JsonResponse
    {
        if (Setting::get('maintenance_mode', '0') === '1') {
            return response()->json(['message' => 'The service is temporarily down for maintenance. Please try again shortly.'], 503);
        }

        if (IpBlocklist::isBlocked($request->ip())) {
            AbuseLog::log($request->ip(), 'blocked_ip_attempt', '/api/jobs', 'blocked', $request->user()?->id);

            return response()->json(['message' => 'Access denied.'], 403);
        }

        $request->validate([
            'tool_type'  => ['required', 'string', 'in:'.implode(',', array_keys(self::JOB_MAP))],
            'file'       => ['required_without:files', 'nullable', 'file'],
            'files'      => ['required_without:file', 'nullable', 'array', 'min:2', 'max:20'],
            'files.*'    => ['file'],
            'options'    => ['sometimes', 'string'],  // JSON string from FormData
        ]);

        $toolType = $request->input('tool_type');

        $toolsEnabled = json_decode(Setting::get('tools_enabled', '{}'), true) ?? [];
        if (($toolsEnabled[$toolType] ?? true) === false) {
            return response()->json(['message' => 'This tool is temporarily unavailable.'], 503);
        }

        if ($quotaError = $this->quota->checkAndIncrement($request, $toolType)) {
            AbuseLog::log($request->ip(), 'quota_exceeded', '/api/jobs', 'rejected', $request->user()?->id, ['tool_type' => $toolType]);

            return response()->json(['message' => $quotaError], 429);
        }

        $options = [];
        if ($request->has('options')) {
            $options = json_decode($request->input('options'), true) ?? [];
        }

        $sizeLimit = $request->user()?->isPremium()
            ? (int) Setting::get('file_size_limit_premium_bytes', 100 * 1024 * 1024)
            : (int) Setting::get('file_size_limit_free_bytes', 20 * 1024 * 1024);

        $allowedMimes = config("pdf.allowed_mimes.{$toolType}", []);

        // ── Multi-file upload (merge, or image-to-pdf with multiple images) ──
        if ($request->hasFile('files')) {
            $files      = $request->file('files');
            $inputPaths = [];

            foreach ($files as $file) {
                $error = $this->validateUpload($request, $file, $sizeLimit, $allowedMimes);
                if ($error) {
                    return $error;
                }

                $key = 'inputs/'.Str::uuid().'/'.basename($file->getClientOriginalName());
                Storage::disk()->putFileAs(dirname($key), $file, basename($key));
                $inputPaths[] = $key;
            }

            $inputPath = json_encode($inputPaths);
        } else {
            // ── Single-file upload ────────────────────────────────────────────
            $file  = $request->file('file');
            $error = $this->validateUpload($request, $file, $sizeLimit, $allowedMimes);
            if ($error) {
                return $error;
            }

            $inputPath = 'inputs/'.Str::uuid().'/'.basename($file->getClientOriginalName());
            Storage::disk()->putFileAs(dirname($inputPath), $file, basename($inputPath));
        }

        $pdfJob = PdfJob::create([
            'user_id'      => $request->user()?->id,
            'tool_type'    => $toolType,
            'status'       => 'pending',
            'input_path'   => $inputPath,
            'options'      => $options ?: null,
            'delete_after' => now()->addHours(12),
        ]);

        self::JOB_MAP[$toolType]::dispatch($pdfJob->id);

        return response()->json([
            'job' => [
                'id'         => $pdfJob->id,
                'status'     => $pdfJob->status,
                'tool_type'  => $pdfJob->tool_type,
                'created_at' => $pdfJob->created_at,
            ],
        ], 202);
    }

    /** Paginated job history for the authenticated user. */
    public function index(Request $request): JsonResponse
    {
        $jobs = $request->user()
            ->pdfJobs()
            ->latest()
            ->paginate(20)
            ->through(fn (PdfJob $job) => [
                'id'                  => $job->id,
                'tool_type'           => $job->tool_type,
                'status'              => $job->status,
                'processing_time_ms'  => $job->processing_time_ms,
                'created_at'          => $job->created_at,
            ]);

        return response()->json($jobs);
    }

    public function show(string $id): JsonResponse
    {
        $pdfJob = PdfJob::findOrFail($id);

        $response = [
            'id'            => $pdfJob->id,
            'status'        => $pdfJob->status,
            'tool_type'     => $pdfJob->tool_type,
            'created_at'    => $pdfJob->created_at,
            'download_url'  => null,
            'error_message' => null,
        ];

        if ($pdfJob->isCompleted() && $pdfJob->output_path) {
            /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
            $disk = Storage::disk();
            $response['download_url'] = $disk->providesTemporaryUrls()
                ? $disk->temporaryUrl($pdfJob->output_path, now()->addMinutes(15))
                : $disk->url($pdfJob->output_path);
        }

        if ($pdfJob->isFailed()) {
            $response['error_message'] = $pdfJob->error_message;
        }

        return response()->json(['job' => $response]);
    }

    // ─────────────────────────────────────────────────────────────────────────

    private function validateUpload(
        Request $request,
        \Illuminate\Http\UploadedFile $file,
        int $sizeLimit,
        array $allowedMimes
    ): ?JsonResponse {
        if ($file->getSize() > $sizeLimit) {
            return response()->json([
                'message'     => 'File exceeds the size limit for your plan.',
                'limit_bytes' => $sizeLimit,
            ], 422);
        }

        if ($allowedMimes) {
            $detected = mime_content_type($file->getPathname());
            if (! in_array($detected, $allowedMimes, true)) {
                AbuseLog::log($request->ip(), 'invalid_file_type', '/api/jobs', 'rejected', $request->user()?->id, ['detected' => $detected, 'allowed' => $allowedMimes]);

                return response()->json([
                    'message' => 'Invalid file type for this tool.',
                    'allowed' => $allowedMimes,
                ], 422);
            }
        }

        if (! $this->scanner->scan($file->getPathname())) {
            AbuseLog::log($request->ip(), 'scan_failure', '/api/jobs', 'rejected', $request->user()?->id);

            return response()->json(['message' => 'File failed security scan.'], 422);
        }

        return null;
    }
}
