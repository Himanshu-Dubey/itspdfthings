<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    private function containsUrlOrScript(string $value): bool
    {
        $clean = preg_replace('/\[url.*?\].*?\[\/url\]/i', '', $value);
        $clean = preg_replace('/\[link.*?\].*?\[\/link\]/i', '', $clean);

        if (preg_match('/https?:\/\/|ftp:\/\/|www\.[a-z0-9]|\/\/[a-z0-9]/i', $clean)) {
            return true;
        }

        if (preg_match('/<\s*script|<\s*iframe|<\s*form|<\s*input|<\s*textarea|<\s*object|<\s*embed|<\s*base|javascript:|data:text\/html|vbscript:/i', $clean)) {
            return true;
        }

        return false;
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'    => ['nullable', 'string', 'max:255'],
            'email'   => ['nullable', 'email', 'max:255'],
            'type'    => ['nullable', 'string', 'in:general,bug,feature,suggestion,other'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'hp'      => ['sometimes', 'string', 'max:0'],
            'ts'      => ['required', 'numeric'],
        ]);

        // Honeypot — bots fill hidden fields
        if (!empty($data['hp'])) {
            abort(422, 'Submission rejected.');
        }

        // Time check — reject if submitted faster than 3 seconds
        $elapsed = time() - intval($data['ts']);
        if ($elapsed < 3) {
            abort(422, 'Submission rejected. Please try again.');
        }

        // Block URLs and scripts in all text fields
        foreach (['name', 'subject', 'message'] as $field) {
            $value = $data[$field] ?? '';
            if ($value && $this->containsUrlOrScript($value)) {
                return response()->json([
                    'message' => 'URLs and code snippets are not allowed.',
                ], 422);
            }
        }

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
