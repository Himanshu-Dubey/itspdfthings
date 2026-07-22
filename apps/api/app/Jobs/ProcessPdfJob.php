<?php

namespace App\Jobs;

use App\Models\PdfJob;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Exception\ProcessTimedOutException;
use Symfony\Component\Process\Process;
use Throwable;

abstract class ProcessPdfJob implements ShouldQueue
{
    use Queueable;

    public int $timeout = 120;
    public int $tries   = 1;

    public function __construct(protected string $pdfJobId) {}

    final public function handle(): void
    {
        // Heartbeat key — admin dashboard reads this to confirm the worker is alive.
        Redis::connection()->setex('queue_worker:heartbeat', 300, time());

        $pdfJob = PdfJob::findOrFail($this->pdfJobId);
        $pdfJob->update(['status' => 'processing']);

        $scratchDir = storage_path('app/scratch/'.$this->pdfJobId);
        $startedAt  = microtime(true);

        try {
            @mkdir($scratchDir, 0700, true);

            $this->process($pdfJob, $scratchDir);

            $pdfJob->update([
                'status'             => 'completed',
                'processing_time_ms' => (int) round((microtime(true) - $startedAt) * 1000),
            ]);
        } catch (Throwable $e) {
            Log::error('PDF job failed', [
                'job_id' => $this->pdfJobId,
                'tool'   => $pdfJob->tool_type,
                'error'  => $e->getMessage(),
            ]);

            $pdfJob->update([
                'status'        => 'failed',
                'error_message' => $e->getMessage(),
            ]);
        } finally {
            $this->wipeScratch($scratchDir);
        }
    }

    abstract protected function process(PdfJob $pdfJob, string $scratchDir): void;

    // ── Helpers ───────────────────────────────────────────────────────────────

    /** Download a single file from storage into the scratch dir and return its local path. */
    protected function download(string $storagePath, string $scratchDir, ?string $name = null): string
    {
        $local  = $scratchDir.'/'.($name ?? basename($storagePath));
        $stream = Storage::disk()->readStream($storagePath);
        file_put_contents($local, $stream);
        if (is_resource($stream)) {
            fclose($stream);
        }
        return $local;
    }

    /** Upload a local file to storage under outputs/{jobId}/ and return the storage key. */
    protected function upload(string $localPath, string $jobId, ?string $name = null): string
    {
        $key = 'outputs/'.$jobId.'/'.($name ?? basename($localPath));
        Storage::disk()->put($key, file_get_contents($localPath));
        return $key;
    }

    /**
     * Run an external command with a hard wall-clock timeout; throws
     * RuntimeException on a non-zero exit or on timeout. Network isolation
     * and memory caps for these subprocesses are enforced at the container
     * level in production (queue-worker container has no network egress and
     * a Docker memory limit) — that isn't achievable portably from PHP itself.
     */
    protected function exec(array $args, int $timeoutSeconds = 60): void
    {
        $process = new Process($args);
        $process->setTimeout($timeoutSeconds);

        try {
            $process->run();
        } catch (ProcessTimedOutException) {
            throw new \RuntimeException("Command timed out after {$timeoutSeconds}s: ".implode(' ', $args));
        }

        if (! $process->isSuccessful()) {
            throw new \RuntimeException(
                $this->humanizeError($process->getErrorOutput().$process->getOutput())
            );
        }
    }

    /** Resolve a CLI tool path from config. */
    protected function tool(string $name): string
    {
        return (string) config('pdf.tools.'.$name, $name);
    }

    private function wipeScratch(string $dir): void
    {
        if (is_dir($dir)) {
            array_map('unlink', glob($dir.'/*') ?: []);
            @rmdir($dir);
        }
    }

    /**
     * Convert raw CLI error output into a short, user-friendly message.
     * Strips file paths, exit codes, and internal tool details.
     */
    private function humanizeError(string $raw): string
    {
        $raw = trim($raw);

        // Common qpdf errors
        if (str_contains($raw, 'out of range')) {
            return 'The page range you entered is invalid for this PDF. Please check the number of pages and try again.';
        }
        if (str_contains($raw, 'parsing numeric range')) {
            return 'The page range format is invalid. Use formats like 1-3, 5, or 7-10.';
        }
        if (str_contains($raw, 'not a valid password')) {
            return 'The password you entered is incorrect.';
        }
        if (str_contains($raw, 'file is not a PDF') || str_contains($raw, 'not a pdf')) {
            return 'The uploaded file is not a valid PDF.';
        }
        if (str_contains($raw, 'is encrypted') || str_contains($raw, 'password protected')) {
            return 'This PDF is password-protected. Please unlock it first.';
        }
        if (str_contains($raw, 'permission denied') || str_contains($raw, 'EACCES')) {
            return 'Permission denied. The file may be in use.';
        }
        if (str_contains($raw, 'No such file')) {
            return 'The uploaded file could not be found. Please try uploading again.';
        }
        if (str_contains($raw, 'timed out') || str_contains($raw, 'timeout')) {
            return 'The operation took too long. Try with a smaller file.';
        }

        // Fallback: strip file paths and return generic message
        // Remove anything that looks like a Windows or Unix file path
        $cleaned = preg_replace('/[A-Z]:\\\\[^\s:]+/i', '', $raw);
        $cleaned = preg_replace('/\/[^\s:]+/', '', $cleaned);
        $cleaned = preg_replace('/Command failed \(exit \d+\):\s*/', '', $cleaned);
        $cleaned = trim($cleaned);

        if ($cleaned !== '') {
            // Cap at 200 chars for display
            $cleaned = mb_strlen($cleaned) > 200 ? mb_substr($cleaned, 0, 200).'…' : $cleaned;
            return 'Something went wrong: '.$cleaned;
        }

        return 'An unexpected error occurred while processing your PDF. Please try again.';
    }

    public function failed(Throwable $e): void
    {
        PdfJob::where('id', $this->pdfJobId)
            ->whereNotIn('status', ['completed', 'failed'])
            ->update([
                'status'        => 'failed',
                'error_message' => $e->getMessage(),
            ]);
    }
}
