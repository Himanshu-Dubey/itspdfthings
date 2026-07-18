<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    /** Read-only, paginated — every admin action ever taken. Nothing here is editable or deletable. */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'per_page' => ['sometimes', 'integer', 'min:10', 'max:100'],
        ]);

        $logs = AdminAuditLog::with('admin:id,name')
            ->latest('created_at')
            ->paginate($request->integer('per_page', 25));

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
}
