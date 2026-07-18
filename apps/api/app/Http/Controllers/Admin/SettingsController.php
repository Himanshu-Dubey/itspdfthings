<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SettingsController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['settings' => Setting::allAsMap()]);
    }

    public function update(Request $request): JsonResponse
    {
        $admin = Auth::guard('admin')->user();

        $data = $request->validate([
            'settings'   => ['required', 'array'],
            'settings.*' => ['nullable', 'string', 'max:2000'],
        ]);

        $before = Setting::allAsMap();

        Setting::setMany($data['settings']);

        AdminAuditLog::record(
            adminId:     $admin->id,
            action:      'settings.update',
            subjectType: 'settings',
            subjectId:   0,
            before:      $before,
            after:       Setting::allAsMap(),
            ip:          $request->ip(),
        );

        return response()->json(['settings' => Setting::allAsMap()]);
    }
}
