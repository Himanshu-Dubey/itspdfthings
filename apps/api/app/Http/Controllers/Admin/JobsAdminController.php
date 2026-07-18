<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PdfJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class JobsAdminController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'status'    => ['sometimes', 'in:pending,processing,completed,failed'],
            'tool_type' => ['sometimes', 'string'],
            'per_page'  => ['sometimes', 'integer', 'min:10', 'max:100'],
        ]);

        $q = PdfJob::with('user:id,name,email');

        if ($status = $request->input('status')) {
            $q->where('status', $status);
        }

        if ($tool = $request->input('tool_type')) {
            $q->where('tool_type', $tool);
        }

        $jobs = $q->latest()->paginate($request->integer('per_page', 25));

        return response()->json([
            'jobs' => $jobs->items(),
            'meta' => [
                'total'        => $jobs->total(),
                'per_page'     => $jobs->perPage(),
                'current_page' => $jobs->currentPage(),
                'last_page'    => $jobs->lastPage(),
            ],
        ]);
    }

    public function stats(): JsonResponse
    {
        $byTool = PdfJob::selectRaw('tool_type, status, count(*) as n, avg(processing_time_ms) as avg_ms')
            ->groupBy('tool_type', 'status')
            ->get()
            ->groupBy('tool_type')
            ->map(fn ($rows) => $rows->keyBy('status'));

        $today = PdfJob::whereDate('created_at', today())
            ->selectRaw('status, count(*) as n')
            ->groupBy('status')
            ->pluck('n', 'status');

        return response()->json(['by_tool' => $byTool, 'today' => $today]);
    }

    public function cleanup(Request $request): JsonResponse
    {
        $jobs = PdfJob::where('delete_after', '<=', now())
            ->whereIn('status', ['completed', 'failed'])
            ->get();

        $deleted = 0;
        foreach ($jobs as $job) {
            foreach ($this->pathsForJob($job) as $path) {
                Storage::disk()->delete($path);
            }
            $job->delete();
            $deleted++;
        }

        return response()->json(['deleted' => $deleted]);
    }

    public function failedQueue(): JsonResponse
    {
        $failed = DB::table('failed_jobs')->latest('failed_at')->limit(50)->get();
        return response()->json(['failed_jobs' => $failed]);
    }

    public function retryFailed(int $id): JsonResponse
    {
        $job = DB::table('failed_jobs')->find($id);
        if (! $job) {
            return response()->json(['message' => 'Job not found.'], 404);
        }

        // queue:retry uses the UUID; use artisan programmatically
        \Artisan::call('queue:retry', ['id' => [$job->uuid]]);

        return response()->json(['message' => 'Job queued for retry.']);
    }

    public function deleteFailed(int $id): JsonResponse
    {
        $deleted = DB::table('failed_jobs')->where('id', $id)->delete();
        if (! $deleted) {
            return response()->json(['message' => 'Job not found.'], 404);
        }

        return response()->json(['message' => 'Failed job deleted.']);
    }

    private function pathsForJob(PdfJob $job): array
    {
        $paths = [];

        if ($job->output_path) {
            $paths[] = $job->output_path;
        }

        $decoded = json_decode($job->input_path ?? '', true);
        if (is_array($decoded)) {
            $paths = array_merge($paths, $decoded);
        } elseif ($job->input_path) {
            $paths[] = $job->input_path;
        }

        return $paths;
    }
}
