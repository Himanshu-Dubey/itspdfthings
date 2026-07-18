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
                'Command failed (exit '.$process->getExitCode().'): '.$process->getErrorOutput().$process->getOutput()
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
