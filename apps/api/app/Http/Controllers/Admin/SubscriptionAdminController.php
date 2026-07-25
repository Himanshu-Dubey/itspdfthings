<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Razorpay\Api\Api as RazorpayApi;

class SubscriptionAdminController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $all = collect();

        // Stripe subscriptions (from Cashier `subscriptions` table)
        if (Schema::hasTable('subscriptions')) {
            $stripeRows = DB::table('subscriptions')
                ->join('users', 'subscriptions.user_id', '=', 'users.id')
                ->select([
                    'subscriptions.id',
                    DB::raw("'stripe' as provider"),
                    'subscriptions.stripe_id as provider_id',
                    'subscriptions.stripe_status as status',
                    'subscriptions.stripe_price as price',
                    'subscriptions.ends_at',
                    'subscriptions.created_at',
                    'users.id as user_id',
                    'users.name as user_name',
                    'users.email as user_email',
                    'users.plan as user_plan',
                ])
                ->orderByDesc('subscriptions.created_at')
                ->get();
            $all = $all->concat($stripeRows);
        }

        // Razorpay subscriptions (from users table)
        $razorpayRows = DB::table('users')
            ->whereNotNull('razorpay_subscription_id')
            ->select([
                'users.id as user_id',
                'users.name as user_name',
                'users.email as user_email',
                'users.plan as user_plan',
                'users.razorpay_subscription_id as provider_id',
                'users.razorpay_subscription_status as status',
                'users.created_at',
            ])
            ->orderByDesc('users.created_at')
            ->get()
            ->map(fn($row) => (array) $row + [
                'id'        => null,
                'provider'  => 'razorpay',
                'price'     => null,
                'ends_at'   => null,
            ]);
        $all = $all->concat($razorpayRows);

        // Sort by created_at desc, paginate manually
        $all = $all->sortByDesc('created_at')->values();
        $perPage = 25;
        $page = (int) $request->input('page', 1);
        $paged = $all->slice(($page - 1) * $perPage, $perPage)->values();
        $total = $all->count();

        return response()->json([
            'subscriptions' => $paged,
            'meta' => [
                'total'        => $total,
                'per_page'     => $perPage,
                'current_page' => $page,
                'last_page'    => (int) ceil($total / $perPage),
            ],
            'stripe_configured'  => $this->stripeConfigured(),
            'razorpay_configured' => ! empty(config('services.razorpay.key')),
        ]);
    }

    public function metrics(): JsonResponse
    {
        $stripeActive = 0;
        $stripeCancelled = 0;
        $stripePastDue = 0;

        if (Schema::hasTable('subscriptions')) {
            $stripeActive    = DB::table('subscriptions')->where('stripe_status', 'active')->count();
            $stripeCancelled = DB::table('subscriptions')->where('stripe_status', 'canceled')->count();
            $stripePastDue   = DB::table('subscriptions')->where('stripe_status', 'past_due')->count();
        }

        $razorpayActive = User::whereNotNull('razorpay_subscription_id')
            ->whereIn('razorpay_subscription_status', ['active', 'authenticated', 'charged'])
            ->count();
        $razorpayCancelled = User::whereNotNull('razorpay_subscription_id')
            ->where('razorpay_subscription_status', 'cancelled')
            ->count();

        return response()->json([
            'active'             => $stripeActive + $razorpayActive,
            'cancelled'          => $stripeCancelled + $razorpayCancelled,
            'past_due'           => $stripePastDue,
            'premium_users'      => User::where('plan', 'premium')->count(),
            'stripe_configured'  => $this->stripeConfigured(),
            'razorpay_configured' => ! empty(config('services.razorpay.key')),
        ]);
    }

    /**
     * Fetch live Razorpay subscription details + invoices.
     */
    public function razorpayDetail(Request $request): JsonResponse
    {
        $request->validate([
            'subscription_id' => ['required', 'string'],
        ]);

        $key    = config('services.razorpay.key');
        $secret = config('services.razorpay.secret');

        if (! $key || ! $secret) {
            return response()->json(['message' => 'Razorpay is not configured.'], 503);
        }

        try {
            $api = new RazorpayApi($key, $secret);
            $subscription = $api->subscription->fetch($request->input('subscription_id'));

            // Fetch invoices for this subscription
            $invoices = $api->invoice->all([
                'subscription_id' => $request->input('subscription_id'),
                'count'           => 10,
            ]);

            $invoiceList = collect($invoices->items ?? [])->map(fn($inv) => [
                'id'         => $inv->id,
                'invoice_id' => $inv->invoice_number ?? $inv->id,
                'amount'     => $inv->amount,
                'currency'   => $inv->currency,
                'status'     => $inv->status,
                'paid_at'    => $inv->paid_at,
                'created_at' => $inv->created_at,
                'pdf_url'    => $inv->short_url,
            ]);

            return response()->json([
                'subscription' => [
                    'id'           => $subscription->id,
                    'plan_id'      => $subscription->plan_id,
                    'status'       => $subscription->status,
                    'current_start' => $subscription->current_start,
                    'current_end'  => $subscription->current_end,
                    'charged_count' => $subscription->charged_count,
                    'total_count'  => $subscription->total_count,
                    'start'        => $subscription->start,
                    'end'          => $subscription->end,
                    'created_at'   => $subscription->created_at,
                ],
                'invoices' => $invoiceList,
            ]);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Failed to fetch Razorpay subscription: ' . $e->getMessage()], 500);
        }
    }

    private function stripeConfigured(): bool
    {
        return ! empty(config('cashier.secret')) && ! empty(config('services.stripe.premium_price_id'));
    }
}
