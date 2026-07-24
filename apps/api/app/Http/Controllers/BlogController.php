<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Post::latestPublished()
            ->with(['category', 'tags'])
            ->select([
                'id', 'title', 'slug', 'excerpt', 'featured_image',
                'category_id', 'reading_time', 'published_at',
            ]);

        if ($request->has('category') && $request->category) {
            $category = Category::where('slug', $request->category)->first();
            if ($category) {
                $query->where('category_id', $category->id);
            }
        }

        if ($request->has('tag') && $request->tag) {
            $tag = Tag::where('slug', $request->tag)->first();
            if ($tag) {
                $query->whereHas('tags', fn($q) => $q->where('tags.id', $tag->id));
            }
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        $posts = $query->paginate(12);

        $categories = Category::ordered()->get(['id', 'name', 'slug']);

        return response()->json([
            'posts'      => $posts,
            'categories' => $categories,
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $post = Post::where('slug', $slug)
            ->where('is_published', true)
            ->where('published_at', '<=', now())
            ->with(['category', 'tags', 'author', 'approvedComments'])
            ->firstOrFail();

        $post->increment('views_count');

        $recentPosts = Post::latestPublished()
            ->where('id', '!=', $post->id)
            ->select(['id', 'title', 'slug', 'featured_image', 'published_at', 'reading_time'])
            ->limit(4)
            ->get();

        return response()->json([
            'post'         => $post,
            'recent_posts' => $recentPosts,
        ]);
    }

    public function submitComment(Request $request, int $postId): JsonResponse
    {
        $post = Post::findOrFail($postId);

        if (!$post->allow_comments) {
            return response()->json(['message' => 'Comments are disabled for this post.'], 403);
        }

        $data = $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'email'   => ['required', 'email', 'max:255'],
            'content' => ['required', 'string', 'max:2000'],
        ]);

        $comment = $post->comments()->create($data);

        return response()->json([
            'message' => 'Comment submitted and awaiting moderation.',
            'comment' => $comment,
        ], 201);
    }
}
