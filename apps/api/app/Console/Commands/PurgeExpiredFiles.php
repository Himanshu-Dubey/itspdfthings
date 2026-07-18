<?php

namespace App\Console\Commands;

use App\Models\PdfJob;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class PurgeExpiredFiles extends Command
{
    protected $signature = 'files:purge-expired';

    protected $description = 'Delete expired uploaded/processed files from object storage and remove their DB rows.';

    public function handle(): int
    {
        $expired = PdfJob::query()
            ->whereNotNull('delete_after')
            ->where('delete_after', '<=', now())
            ->get();

        foreach ($expired as $job) {
            foreach ([$job->input_path, $job->output_path] as $path) {
                if ($path && Storage::disk()->exists($path)) {
                    Storage::disk()->delete($path);
                }
            }
            $job->delete();
        }

        $this->info("Purged {$expired->count()} expired job(s).");

        Cache::put('scheduler:purge_expired:last_run', now()->toIso8601String(), now()->addDays(2));

        return self::SUCCESS;
    }
}
