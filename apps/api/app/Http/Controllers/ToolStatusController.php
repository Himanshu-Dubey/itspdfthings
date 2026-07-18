<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class ToolStatusController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'maintenance_mode' => Setting::get('maintenance_mode', '0') === '1',
            'tools_enabled'    => json_decode(Setting::get('tools_enabled', '{}'), true) ?? [],
            'announcement'     => [
                'message'    => Setting::get('announcement_banner') ?: null,
                'link'       => Setting::get('announcement_link') ?: null,
                'expires_at' => Setting::get('announcement_expires_at') ?: null,
            ],
        ]);
    }
}
