<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PdfJob;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Storage;

class DashboardController extends Controller
{
    public function metrics(): JsonResponse
    {
        $today = now()->toDateString();

        $metrics = Cache::remember('admin.dashboard.metrics', 60, function () use ($today) {
            return [
                'total_users' => User::count(),
                'jobs_today' => PdfJob::whereDate('created_at', $today)->count(),
                'failed_jobs_today' => PdfJob::whereDate('created_at', $today)->where('status', 'failed')->count(),
                'completed_jobs_today' => PdfJob::whereDate('created_at', $today)->where('status', 'completed')->count(),
                'jobs_by_status' => PdfJob::select('status', DB::raw('count(*) as count'))
                    ->groupBy('status')
                    ->pluck('count', 'status')
                    ->toArray(),
                'signups_last_30_days' => User::where('created_at', '>=', now()->subDays(30))
                    ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                    ->groupBy('date')
                    ->orderBy('date')
                    ->pluck('count', 'date')
                    ->toArray(),
            ];
        });

        return response()->json(['metrics' => $metrics]);
    }

    public function queueStatus(): JsonResponse
    {
        try {
            $pending = DB::table('queue_jobs')->where('queue', 'default')->count();
            $failed = DB::table('failed_jobs')->count();
        } catch (\Throwable) {
            $pending = 0;
            $failed = 0;
        }

        $processing = PdfJob::where('status', 'processing')->count();

        return response()->json([
            'queue' => [
                'pending' => $pending,
                'processing' => $processing,
                'failed' => $failed,
            ],
        ]);
    }

    public function systemHealth(): JsonResponse
    {
        // Worker heartbeat — updated by the queue worker every 60 s.
        $heartbeatTs = Redis::connection()->get('queue_worker:heartbeat');
        $workerAlive = $heartbeatTs && (time() - (int) $heartbeatTs) < 90;

        // Last completed job — fallback indicator when heartbeat key is absent.
        $lastJob = PdfJob::whereIn('status', ['completed', 'failed'])
            ->latest('updated_at')
            ->value('updated_at');

        // Storage usage: sum sizes of all files under the inputs/ directory.
        $totalBytes = collect(Storage::disk()->allFiles('inputs'))
            ->sum(fn (string $file) => Storage::disk()->size($file));
        $storageMb = round($totalBytes / (1024 * 1024), 2);

        // Scheduler health: read the timestamp written by the purge command.
        $purgeLastRun = Cache::get('scheduler:purge_expired:last_run');

        return response()->json([
            'health' => [
                'worker_alive'      => $workerAlive,
                'worker_last_beat'  => $heartbeatTs ? date('c', (int) $heartbeatTs) : null,
                'last_job_at'       => $lastJob,
                'storage_inputs_mb' => $storageMb,
                'purge_last_run'    => $purgeLastRun,
                'php_version'       => PHP_VERSION,
                'laravel_version'   => app()->version(),
            ],
        ]);
    }
}
