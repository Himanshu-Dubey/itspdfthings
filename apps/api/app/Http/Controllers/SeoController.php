<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\JsonResponse;

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
}
