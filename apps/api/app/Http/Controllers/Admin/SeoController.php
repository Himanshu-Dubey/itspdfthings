<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SeoController extends Controller
{
    public function index(): JsonResponse
    {
        $all = Setting::allAsMap();

        $globalVal = $all['seo_global'] ?? '{}';
        $global = is_array($globalVal) ? $globalVal : (json_decode($globalVal, true) ?? []);
        $pages = [];

        $pageKeys = [
            'homepage', 'pricing', 'privacy', 'terms',
            'merge-pdf', 'split-pdf', 'compress-pdf', 'organize-pdf',
            'image-to-pdf', 'pdf-to-image', 'watermark-pdf',
            'page-numbers', 'protect-pdf',
        ];

        foreach ($pageKeys as $key) {
            $raw = $all["seo_{$key}"] ?? null;
            if ($raw === null) {
                $pages[$key] = null;
            } else {
                $pages[$key] = is_array($raw) ? $raw : (json_decode($raw, true) ?? null);
            }
        }

        return response()->json([
            'global' => $global,
            'pages'  => $pages,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $admin = Auth::guard('admin')->user();

        \Log::channel('daily')->info('SEO update request', [
            'method'      => $request->method(),
            'content_type'=> $request->header('Content-Type'),
            'all_keys'    => array_keys($request->all()),
            'has_settings'=> $request->has('settings'),
            'settings_type'=> gettype($request->input('settings')),
            'input_raw'   => substr($request->getContent(), 0, 500),
        ]);

        $settings = $request->input('settings');

        if (!is_array($settings)) {
            $settings = [];
            foreach ($request->all() as $key => $value) {
                if (str_starts_with($key, 'seo_')) {
                    $settings[$key] = $value;
                }
            }
        }

        if (empty($settings)) {
            return response()->json(['error' => 'No settings provided', 'debug' => $request->all()], 422);
        }

        $before = Setting::allAsMap();

        Setting::setMany($settings);

        AdminAuditLog::record(
            adminId:     $admin->id,
            action:      'seo.update',
            subjectType: 'seo',
            subjectId:   0,
            before:      array_filter($before, fn ($k) => str_starts_with((string) $k, 'seo_'), ARRAY_FILTER_USE_KEY),
            after:       array_filter(Setting::allAsMap(), fn ($k) => str_starts_with((string) $k, 'seo_'), ARRAY_FILTER_USE_KEY),
            ip:          $request->ip(),
        );

        return response()->json(['message' => 'SEO settings updated.']);
    }

    public function uploadOg(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'max:2048', 'mimes:png,jpg,jpeg,webp'],
        ]);

        $file = $request->file('file');
        $name = 'og/' . $file->getClientOriginalName();
        $file->storeAs('public', $name);

        return response()->json([
            'url' => Storage::url($name),
        ]);
    }
}
