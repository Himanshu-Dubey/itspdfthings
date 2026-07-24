<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Comment::with('post');

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('is_approved', $request->status === 'approved');
        }

        if ($request->has('post_id') && $request->post_id) {
            $query->where('post_id', $request->post_id);
        }

        $comments = $query->latest()->paginate(30);

        return response()->json(['comments' => $comments]);
    }

    public function approve(int $id): JsonResponse
    {
        $comment = Comment::findOrFail($id);
        $comment->update(['is_approved' => true]);

        return response()->json(['message' => 'Comment approved.']);
    }

    public function reject(int $id): JsonResponse
    {
        $comment = Comment::findOrFail($id);
        $comment->update(['is_approved' => false]);

        return response()->json(['message' => 'Comment rejected.']);
    }

    public function destroy(int $id): JsonResponse
    {
        Comment::findOrFail($id)->delete();

        return response()->json(['message' => 'Comment deleted.']);
    }
}
