<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    private function containsUrlOrScript(string $value): bool
    {
        // Strip common markdown/BBcode link syntax
        $clean = preg_replace('/\[url.*?\].*?\[\/url\]/i', '', $value);
        $clean = preg_replace('/\[link.*?\].*?\[\/link\]/i', '', $clean);

        // Check for URLs (http, https, ftp, and protocol-relative)
        if (preg_match('/https?:\/\/|ftp:\/\/|www\.[a-z0-9]|\/\/[a-z0-9]/i', $clean)) {
            return true;
        }

        // Check for HTML/script tags
        if (preg_match('/<\s*script|<\s*iframe|<\s*form|<\s*input|<\s*textarea|<\s*object|<\s*embed|<\s*base|javascript:|data:text\/html|vbscript:/i', $clean)) {
            return true;
        }

        return false;
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|max:5000',
            'hp'      => ['sometimes', 'nullable', 'string', 'max:0'],
            'ts'      => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        // Honeypot — bots fill hidden fields
        if (!empty($request->input('hp'))) {
            abort(422, 'Submission rejected.');
        }

        // Time check — reject if submitted faster than 3 seconds
        $elapsed = time() - intval($request->input('ts'));
        if ($elapsed < 3) {
            abort(422, 'Submission rejected. Please try again.');
        }

        // Block URLs and scripts in all text fields
        foreach (['name', 'subject', 'message'] as $field) {
            $value = $request->input($field, '');
            if ($value && $this->containsUrlOrScript($value)) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors'  => [$field => ['URLs and code snippets are not allowed.']],
                ], 422);
            }
        }

        $lead = Lead::create([
            'name'       => $request->input('name'),
            'email'      => $request->input('email'),
            'subject'    => $request->input('subject', 'Contact Form'),
            'message'    => $request->input('message'),
            'source'     => 'contact_form',
            'status'     => 'new',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'message' => 'Thank you for your message. We will get back to you shortly.',
            'lead'    => $lead,
        ], 201);
    }
}
