<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TagController extends Controller
{
    public function index(): JsonResponse
    {
        $tags = Tag::withCount('posts')->alphabetical()->get();

        return response()->json(['tags' => $tags]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:tags,name'],
            'slug' => ['nullable', 'string', 'max:255'],
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['name']);
        $tag = Tag::create($data);

        return response()->json(['tag' => $tag], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $tag = Tag::findOrFail($id);

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255', 'unique:tags,name,' . $id],
            'slug' => ['sometimes', 'string', 'max:255'],
        ]);

        $tag->update($data);

        return response()->json(['tag' => $tag]);
    }

    public function destroy(int $id): JsonResponse
    {
        $tag = Tag::findOrFail($id);

        $tag->posts()->detach();
        $tag->delete();

        return response()->json(['message' => 'Tag deleted.']);
    }
}
