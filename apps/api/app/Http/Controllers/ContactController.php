<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
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
