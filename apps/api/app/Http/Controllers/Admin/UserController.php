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

        $subscription = null;
        $invoices = [];

        // Fetch Razorpay subscription details if user has one
        if ($user->razorpay_subscription_id) {
            $key    = config('services.razorpay.key');
            $secret = config('services.razorpay.secret');

            if ($key && $secret) {
                try {
                    $api = new \Razorpay\Api\Api($key, $secret);
                    $sub = $api->subscription->fetch($user->razorpay_subscription_id);

                    $subscription = [
                        'provider'     => 'razorpay',
                        'id'           => $sub->id,
                        'status'       => $sub->status,
                        'plan_id'      => $sub->plan_id,
                        'current_start' => $sub->current_start,
                        'current_end'  => $sub->current_end,
                        'charged_count' => $sub->charged_count,
                        'total_count'  => $sub->total_count,
                    ];

                    $invRes = $api->invoice->all(['subscription_id' => $user->razorpay_subscription_id, 'count' => 5]);
                    $invoices = collect($invRes->items ?? [])->map(fn($inv) => [
                        'id'         => $inv->id,
                        'invoice_id' => $inv->invoice_number ?? $inv->id,
                        'amount'     => $inv->amount,
                        'currency'   => $inv->currency,
                        'status'     => $inv->status,
                        'paid_at'    => $inv->paid_at,
                        'pdf_url'    => $inv->short_url,
                    ])->toArray();
                } catch (\Exception) {
                    // Razorpay unreachable — show what we have
                    $subscription = [
                        'provider' => 'razorpay',
                        'id'       => $user->razorpay_subscription_id,
                        'status'   => $user->razorpay_subscription_status,
                    ];
                }
            } else {
                $subscription = [
                    'provider' => 'razorpay',
                    'id'       => $user->razorpay_subscription_id,
                    'status'   => $user->razorpay_subscription_status,
                ];
            }
        }

        // Fetch Stripe subscription if user has one
        if (! $subscription && $user->hasStripeId() && config('cashier.secret')) {
            try {
                $stripe = new \Stripe\StripeClient(config('cashier.secret'));
                $subs   = $stripe->subscriptions->all(['customer' => $user->stripe_id, 'limit' => 1]);

                if (count($subs->data) > 0) {
                    $sub = $subs->data[0];
                    $subscription = [
                        'provider' => 'stripe',
                        'id'       => $sub->id,
                        'status'   => $sub->status,
                        'plan'     => $sub->items->data[0]->plan->id ?? null,
                        'current_period_end' => $sub->current_period_end,
                        'cancel_at_period_end' => $sub->cancel_at_period_end,
                    ];

                    $invRes = $stripe->invoices->all(['customer' => $user->stripe_id, 'limit' => 5]);
                    $invoices = collect($invRes->data)->map(fn($inv) => [
                        'id'         => $inv->id,
                        'amount'     => $inv->amount_paid,
                        'currency'   => $inv->currency,
                        'status'     => $inv->status,
                        'created_at' => $inv->created,
                        'pdf_url'    => $inv->invoice_pdf,
                    ])->toArray();
                }
            } catch (\Exception) {
                // Stripe unreachable
            }
        }

        return response()->json([
            'user'         => $user,
            'recent_jobs'  => $jobs,
            'job_counts'   => $user->pdfJobs()->selectRaw('status, count(*) as n')->groupBy('status')->pluck('n', 'status'),
            'subscription' => $subscription,
            'invoices'     => $invoices,
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
