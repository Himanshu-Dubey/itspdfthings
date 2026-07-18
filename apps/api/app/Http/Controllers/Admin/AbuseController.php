<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AbuseLog;
use App\Models\AdminAuditLog;
use App\Models\IpBlocklist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AbuseController extends Controller
{
    /** Paginated abuse log, newest first. */
    public function logs(Request $request): JsonResponse
    {
        $request->validate([
            'ip'       => ['sometimes', 'string', 'max:50'],
            'reason'   => ['sometimes', 'string', 'max:100'],
            'per_page' => ['sometimes', 'integer', 'min:10', 'max:100'],
        ]);

        $q = AbuseLog::query()->latest('triggered_at');

        if ($ip = $request->input('ip')) {
            $q->where('ip_address', $ip);
        }

        if ($reason = $request->input('reason')) {
            $q->where('reason', $reason);
        }

        $logs = $q->paginate($request->integer('per_page', 25));

        return response()->json([
            'logs' => $logs->items(),
            'meta' => [
                'total'        => $logs->total(),
                'per_page'     => $logs->perPage(),
                'current_page' => $logs->currentPage(),
                'last_page'    => $logs->lastPage(),
            ],
        ]);
    }

    /** Current IP blocklist (both active and expired entries). */
    public function blocklist(): JsonResponse
    {
        $entries = IpBlocklist::with('blockedBy:id,name')->latest()->get();

        return response()->json(['blocklist' => $entries]);
    }

    /** Block an IP or CIDR range — usable standalone or one-click from an abuse log row. */
    public function blockIp(Request $request): JsonResponse
    {
        $admin = Auth::guard('admin')->user();

        $data = $request->validate([
            'ip_address' => ['required', 'string', 'max:50'],
            'reason'     => ['required', 'string', 'max:1000'],
            'expires_at' => ['nullable', 'date', 'after:now'],
        ]);

        $entry = IpBlocklist::create([
            ...$data,
            'blocked_by' => $admin->id,
        ]);

        AdminAuditLog::record(
            adminId:     $admin->id,
            action:      'ip.block',
            subjectType: 'ip_blocklist',
            subjectId:   $entry->id,
            after:       $data,
            ip:          $request->ip(),
        );

        return response()->json(['entry' => $entry], 201);
    }

    public function unblockIp(Request $request, int $id): JsonResponse
    {
        $admin = Auth::guard('admin')->user();
        $entry = IpBlocklist::findOrFail($id);

        AdminAuditLog::record(
            adminId:     $admin->id,
            action:      'ip.unblock',
            subjectType: 'ip_blocklist',
            subjectId:   $entry->id,
            before:      $entry->only(['ip_address', 'reason']),
            ip:          $request->ip(),
        );

        $entry->delete();

        return response()->json(['message' => 'IP unblocked.']);
    }
}
