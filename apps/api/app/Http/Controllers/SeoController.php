<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class SeoController extends Controller
{
    public function index(): JsonResponse
    {
        $all = Setting::allAsMap();

        $rawGlobal = $all['seo_global'] ?? '{}';
        $global = is_string($rawGlobal) ? (json_decode($rawGlobal, true) ?? []) : $rawGlobal;
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
            } elseif (is_string($raw)) {
                $pages[$key] = json_decode($raw, true);
            } else {
                $pages[$key] = $raw;
            }
        }

        return response()->json([
            'global' => $global,
            'pages'  => $pages,
        ]);
    }
}
