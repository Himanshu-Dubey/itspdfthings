<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'    => ['nullable', 'string', 'max:255'],
            'email'   => ['nullable', 'email', 'max:255'],
            'type'    => ['nullable', 'string', 'in:general,bug,feature,suggestion,other'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $feedback = Feedback::create([
            'name'       => $data['name'] ?? $request->user()?->name,
            'email'      => $data['email'] ?? $request->user()?->email,
            'type'       => $data['type'] ?? 'general',
            'subject'    => $data['subject'] ?? null,
            'message'    => $data['message'],
            'user_id'    => $request->user()?->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'message'  => 'Thank you for your feedback!',
            'feedback' => $feedback,
        ], 201);
    }
}
