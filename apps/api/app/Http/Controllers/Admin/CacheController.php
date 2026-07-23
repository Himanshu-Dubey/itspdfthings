<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;

class CacheController extends Controller
{
    public function clear()
    {
        $results = [];

        // 1. Laravel cache
        Artisan::call('cache:clear');
        $results['cache'] = 'cleared';

        // 2. Config cache
        Artisan::call('config:clear');
        $results['config'] = 'cleared';

        // 3. Route cache
        Artisan::call('route:clear');
        $results['routes'] = 'cleared';

        // 4. View cache
        Artisan::call('view:clear');
        $results['views'] = 'cleared';

        // 5. Rebuild route + config cache (performance)
        Artisan::call('config:cache');
        Artisan::call('route:cache');
        $results['rebuilt'] = ['config', 'routes'];

        // 6. Clear compiled PHP files
        $compiledPath = storage_path('framework/views');
        if (File::isDirectory($compiledPath)) {
            File::cleanDirectory($compiledPath);
        }

        return response()->json([
            'message' => 'All caches cleared and rebuilt.',
            'cleared' => $results,
        ]);
    }

    public function status()
    {
        $diskFree = disk_free_space('/') ?? 0;
        $diskTotal = disk_total_space('/') ?? 0;

        return response()->json([
            'cache_driver' => config('cache.default'),
            'queue_driver' => config('queue.default'),
            'disk_free_mb' => round($diskFree / 1024 / 1024),
            'disk_total_mb' => round($diskTotal / 1024 / 1024),
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'memory_limit' => ini_get('memory_limit'),
            'upload_max_filesize' => ini_get('upload_max_filesize'),
        ]);
    }
}
