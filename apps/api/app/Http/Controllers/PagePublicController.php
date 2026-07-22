<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\JsonResponse;

class PageController extends Controller
{
    /** Public: get a single published page by slug. */
    public function show(string $slug): JsonResponse
    {
        $page = Page::published()->where('slug', $slug)->firstOrFail();

        return response()->json(['page' => $page]);
    }

    /** Public: get all published pages for header/footer navigation. */
    public function navigation(): JsonResponse
    {
        $header = Page::inHeader()->get(['id', 'title', 'slug']);
        $footer = Page::inFooter()->get(['id', 'title', 'slug']);

        return response()->json([
            'header' => $header,
            'footer' => $footer,
        ]);
    }
}
