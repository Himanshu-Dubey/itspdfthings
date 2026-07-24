<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Post::with(['category', 'tags', 'author']);

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('is_published', $request->status === 'published');
        }

        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        $posts = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json(['posts' => $posts]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'              => ['required', 'string', 'max:255'],
            'slug'               => ['nullable', 'string', 'max:255'],
            'excerpt'            => ['nullable', 'string', 'max:1000'],
            'content'            => ['nullable', 'string'],
            'featured_image'     => ['nullable', 'string', 'max:500'],
            'meta_title'         => ['nullable', 'string', 'max:255'],
            'meta_description'   => ['nullable', 'string', 'max:500'],
            'og_title'           => ['nullable', 'string', 'max:255'],
            'og_description'     => ['nullable', 'string', 'max:500'],
            'og_image'           => ['nullable', 'string', 'max:500'],
            'category_id'        => ['nullable', 'integer', 'exists:categories,id'],
            'tags'               => ['nullable', 'array'],
            'tags.*'             => ['integer', 'exists:tags,id'],
            'allow_comments'     => ['boolean'],
            'is_published'       => ['boolean'],
            'published_at'       => ['nullable', 'date'],
            'author_name'        => ['nullable', 'string', 'max:255'],
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['title']);
        $data['author_id'] = Auth::guard('admin')->user()->id;

        if (empty($data['author_name'])) {
            $data['author_name'] = Auth::guard('admin')->user()->name;
        }

        if (Post::where('slug', $data['slug'])->exists()) {
            $data['slug'] = $data['slug'] . '-' . time();
        }

        if (!empty($data['is_published']) && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $tags = $data['tags'] ?? [];
        unset($data['tags']);

        $post = Post::create($data);

        if (!empty($tags)) {
            $post->tags()->sync($tags);
        }

        $post->load(['category', 'tags', 'author']);

        return response()->json(['post' => $post], 201);
    }

    public function show(int $id): JsonResponse
    {
        $post = Post::with(['category', 'tags', 'author', 'comments'])->findOrFail($id);

        return response()->json(['post' => $post]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $post = Post::findOrFail($id);

        $data = $request->validate([
            'title'              => ['sometimes', 'string', 'max:255'],
            'slug'               => ['sometimes', 'string', 'max:255'],
            'excerpt'            => ['nullable', 'string', 'max:1000'],
            'content'            => ['nullable', 'string'],
            'featured_image'     => ['nullable', 'string', 'max:500'],
            'meta_title'         => ['nullable', 'string', 'max:255'],
            'meta_description'   => ['nullable', 'string', 'max:500'],
            'og_title'           => ['nullable', 'string', 'max:255'],
            'og_description'     => ['nullable', 'string', 'max:500'],
            'og_image'           => ['nullable', 'string', 'max:500'],
            'category_id'        => ['nullable', 'integer', 'exists:categories,id'],
            'tags'               => ['nullable', 'array'],
            'tags.*'             => ['integer', 'exists:tags,id'],
            'allow_comments'     => ['boolean'],
            'is_published'       => ['boolean'],
            'published_at'       => ['nullable', 'date'],
            'author_name'        => ['nullable', 'string', 'max:255'],
        ]);

        if (isset($data['slug']) && Post::where('slug', $data['slug'])->where('id', '!=', $id)->exists()) {
            $data['slug'] = $data['slug'] . '-' . time();
        }

        if (isset($data['content']) && !isset($data['reading_time'])) {
            $data['reading_time'] = $post->calculateReadingTime();
        }

        if (isset($data['is_published']) && $data['is_published'] && !$post->published_at) {
            $data['published_at'] = now();
        }

        $tags = $data['tags'] ?? null;
        unset($data['tags']);

        $post->update($data);

        if ($tags !== null) {
            $post->tags()->sync($tags);
        }

        $post->load(['category', 'tags', 'author']);

        return response()->json(['post' => $post]);
    }

    public function destroy(int $id): JsonResponse
    {
        Post::findOrFail($id)->delete();

        return response()->json(['message' => 'Post deleted.']);
    }

    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'max:5120', 'mimes:png,jpg,jpeg,webp,gif'],
        ]);

        $file = $request->file('file');
        $dir = 'blog/' . date('Y-m');
        $name = Str::uuid() . '.' . $file->getClientOriginalExtension();

        $file->storeAs($dir, $name, 'public');

        $url = '/api/files/blog/' . date('Y-m') . '/' . $name;

        return response()->json(['url' => $url]);
    }
}
