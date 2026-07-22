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

        $global = json_decode($all['seo_global'] ?? '{}', true) ?? [];
        $pages = [];

        $pageKeys = [
            'homepage', 'pricing', 'privacy', 'terms',
            'merge-pdf', 'split-pdf', 'compress-pdf', 'organize-pdf',
            'image-to-pdf', 'pdf-to-image', 'watermark-pdf',
            'page-numbers', 'protect-pdf',
        ];

        foreach ($pageKeys as $key) {
            $raw = $all["seo_{$key}"] ?? null;
            $pages[$key] = $raw ? json_decode($raw, true) : null;
        }

        return response()->json([
            'global' => $global,
            'pages'  => $pages,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $admin = Auth::guard('admin')->user();

        $data = $request->validate([
            'settings'              => ['required', 'array'],
            'settings.seo_global'   => ['nullable', 'string', 'max:5000'],
            'settings.seo_*'        => ['nullable', 'string', 'max:10000'],
        ]);

        $before = Setting::allAsMap();

        Setting::setMany($data['settings']);

        AdminAuditLog::record(
            adminId:     $admin->id,
            action:      'seo.update',
            subjectType: 'seo',
            subjectId:   0,
            before:      array_filter($before, fn ($k) => str_starts_with($k, 'seo_'), ARRAY_FILTER_USE_KEY),
            after:       array_filter(Setting::allAsMap(), fn ($k) => str_starts_with($k, 'seo_'), ARRAY_FILTER_USE_KEY),
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
