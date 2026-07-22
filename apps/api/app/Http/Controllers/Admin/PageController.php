<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PageController extends Controller
{
    public function index(): JsonResponse
    {
        $pages = Page::orderBy('menu_order')->orderBy('created_at', 'desc')->get();

        return response()->json(['pages' => $pages]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'            => ['required', 'string', 'max:255'],
            'slug'             => ['nullable', 'string', 'max:255', 'unique:pages,slug'],
            'content'          => ['nullable', 'string'],
            'meta_title'       => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'is_published'     => ['boolean'],
            'show_in_header'   => ['boolean'],
            'show_in_footer'   => ['boolean'],
            'menu_order'       => ['integer', 'min:0'],
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['title']);

        $page = Page::create($data);

        return response()->json(['page' => $page], 201);
    }

    public function show(string $id): JsonResponse
    {
        $page = Page::findOrFail($id);

        return response()->json(['page' => $page]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $page = Page::findOrFail($id);

        $data = $request->validate([
            'title'            => ['sometimes', 'required', 'string', 'max:255'],
            'slug'             => ['sometimes', 'string', 'max:255', 'unique:pages,slug,' . $id],
            'content'          => ['nullable', 'string'],
            'meta_title'       => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'is_published'     => ['boolean'],
            'show_in_header'   => ['boolean'],
            'show_in_footer'   => ['boolean'],
            'menu_order'       => ['integer', 'min:0'],
        ]);

        $page->update($data);

        return response()->json(['page' => $page]);
    }

    public function destroy(string $id): JsonResponse
    {
        Page::findOrFail($id)->delete();

        return response()->json(['message' => 'Page deleted.']);
    }
}
