<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'search'   => ['sometimes', 'string', 'max:100'],
            'plan'     => ['sometimes', 'in:free,premium'],
            'banned'   => ['sometimes', 'boolean'],
            'per_page' => ['sometimes', 'integer', 'min:10', 'max:100'],
            'sort'     => ['sometimes', 'in:created_at,last_active_at,name,email'],
            'dir'      => ['sometimes', 'in:asc,desc'],
        ]);

        $q = User::query();

        if ($search = $request->input('search')) {
            $q->where(function ($sub) use ($search) {
                $sub->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('plan')) {
            $q->where('plan', $request->input('plan'));
        }

        if ($request->has('banned')) {
            $q->where('is_banned', $request->boolean('banned'));
        }

        $sort = $request->input('sort', 'created_at');
        $dir  = $request->input('dir', 'desc');
        $q->orderBy($sort, $dir);

        $users = $q->paginate($request->integer('per_page', 25));

        return response()->json([
            'users' => $users->items(),
            'meta'  => [
                'total'        => $users->total(),
                'per_page'     => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $jobs = $user->pdfJobs()
            ->select(['id', 'tool_type', 'status', 'processing_time_ms', 'created_at'])
            ->latest()
            ->limit(20)
            ->get();

        return response()->json([
            'user' => $user,
            'recent_jobs' => $jobs,
            'job_counts'  => $user->pdfJobs()->selectRaw('status, count(*) as n')->groupBy('status')->pluck('n', 'status'),
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $admin = Auth::guard('admin')->user();
        $user  = User::findOrFail($id);
        $before = $user->only(['plan', 'is_banned', 'banned_reason']);

        $data = $request->validate([
            'plan'          => ['sometimes', 'in:free,premium'],
            'is_banned'     => ['sometimes', 'boolean'],
            'banned_reason' => ['required_if:is_banned,true', 'nullable', 'string', 'max:500'],
            'name'          => ['sometimes', 'string', 'max:255'],
        ]);

        $user->update($data);

        AdminAuditLog::record(
            adminId:     $admin->id,
            action:      'user.update',
            subjectType: 'user',
            subjectId:   $user->id,
            before:      $before,
            after:       $user->only(array_keys($data)),
            ip:          $request->ip(),
        );

        return response()->json(['user' => $user->fresh()]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $admin = Auth::guard('admin')->user();
        $user  = User::findOrFail($id);

        AdminAuditLog::record(
            adminId:     $admin->id,
            action:      'user.delete',
            subjectType: 'user',
            subjectId:   $user->id,
            before:      $user->only(['name', 'email', 'plan']),
            ip:          $request->ip(),
        );

        $user->delete();

        return response()->json(['message' => 'User deleted.']);
    }
}
