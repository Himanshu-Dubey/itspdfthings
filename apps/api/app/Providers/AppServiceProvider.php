<?php

namespace App\Providers;

use App\Contracts\ScansFile;
use App\Models\AbuseLog;
use App\Services\NoOpScanner;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Events\DiagnosingHealth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Swap NoOpScanner for a real ClamAV implementation in Phase 4.
        $this->app->bind(ScansFile::class, NoOpScanner::class);
    }

    public function boot(): void
    {
        // Per-IP upload rate limit — flood/DoS protection, separate from per-tool quotas.
        RateLimiter::for('uploads', function (Request $request) {
            return Limit::perMinute(
                (int) config('app.rate_limits.uploads_per_minute', 10)
            )->by($request->ip())->response(function (Request $request) {
                AbuseLog::log($request->ip(), 'rate_limit_breach', $request->path(), 'rejected', $request->user()?->id);

                return response()->json(['message' => 'Too many requests. Please slow down.'], 429);
            });
        });

        // The /up health route dispatches this event; a listener throwing
        // marks the app unhealthy (503) instead of always reporting 200.
        Event::listen(function (DiagnosingHealth $event) {
            DB::connection()->getPdo();
            Redis::connection()->ping();
        });
    }
}
