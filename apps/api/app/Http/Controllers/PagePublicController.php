<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\JsonResponse;

class PagePublicController extends Controller
{
    /** Public: get a single published page by slug. */
    public function show(string $slug): JsonResponse
    {
        $page = Page::published()->where('slug', $slug)->firstOrFail();

        return response()->json(['page' => $page])
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            ->header('Pragma', 'no-cache')
            ->header('X-Accel-Cache-Control', 'no-cache');
    }

    /** Public: get all published pages for header/footer navigation. */
    public function navigation(): JsonResponse
    {
        $header = Page::inHeader()->get(['id', 'title', 'slug']);
        $footer = Page::inFooter()->get(['id', 'title', 'slug']);

        return response()->json([
            'header' => $header,
            'footer' => $footer,
        ])
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            ->header('Pragma', 'no-cache');
    }
}
