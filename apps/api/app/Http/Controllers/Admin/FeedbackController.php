<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Feedback::with('user')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $perPage = min((int) $request->input('per_page', 20), 100);
        $items   = $query->paginate($perPage);

        return response()->json($items);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'total'  => Feedback::count(),
            'new'    => Feedback::where('status', 'new')->count(),
            'read'   => Feedback::where('status', 'read')->count(),
            'closed' => Feedback::where('status', 'closed')->count(),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $feedback = Feedback::with('user')->findOrFail($id);

        if ($feedback->status === 'new') {
            $feedback->update(['status' => 'read']);
        }

        return response()->json($feedback);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $feedback = Feedback::findOrFail($id);

        $data = $request->validate([
            'status' => ['nullable', 'string', 'in:new,read,closed'],
        ]);

        $feedback->update($data);

        return response()->json($feedback);
    }

    public function destroy(int $id): JsonResponse
    {
        Feedback::findOrFail($id)->delete();

        return response()->json(['message' => 'Feedback deleted.']);
    }
}
