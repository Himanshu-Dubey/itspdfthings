<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Razorpay\Api\Api as RazorpayApi;

class BillingController extends Controller
{
    /** Start a checkout flow for a plan (or the default Premium plan if no plan_id given). */
    public function checkout(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->isPremium()) {
            return response()->json(['message' => 'You already have a Premium subscription.'], 422);
        }

        $planId = $request->input('plan_id');
        $country = $request->input('country', 'US');

        // Check if Stripe is enabled in settings
        $stripeEnabled = \Illuminate\Support\Facades\DB::table('settings')->where('key', 'stripe_enabled')->value('value');
        $stripeEnabled = $stripeEnabled === '1' || $stripeEnabled === 'true';

        // If Stripe disabled, always Razorpay. Otherwise geo-route.
        if (! $stripeEnabled) {
            return $this->razorpayCheckout($user, $planId ? (int) $planId : null);
        }

        $provider = $country === 'IN' ? 'razorpay' : 'stripe';

        return $provider === 'razorpay'
            ? $this->razorpayCheckout($user, $planId ? (int) $planId : null)
            : $this->stripeCheckout($user, $planId ? (int) $planId : null);
    }

    /**
     * Directly query Stripe for the current user's active subscription and
     * update the local `plan` column.  Called on the success-redirect so the
     * plan flips to Premium immediately even when the webhook hasn't arrived yet
     * (e.g. local dev without Stripe CLI).
     */
    public function sync(Request $request): JsonResponse
    {
        $user   = $request->user();
        $secret = config('cashier.secret');

        if (! $secret) {
            return response()->json(['user' => $user]);
        }

        if (! $user->hasStripeId()) {
            return response()->json(['user' => $user]);
        }

        try {
            $stripe = new \Stripe\StripeClient($secret);
            $subs   = $stripe->subscriptions->all([
                'customer' => $user->stripe_id,
                'status'   => 'active',
                'limit'    => 1,
            ]);

            $newPlan = count($subs->data) > 0 ? 'premium' : 'free';
            $user->forceFill(['plan' => $newPlan])->save();
        } catch (\Exception) {
            // Stripe unreachable — return existing user without crashing.
        }

        return response()->json(['user' => $user->fresh()]);
    }

    /** Return a self-service billing management URL, via whichever provider is active. */
    public function portal(Request $request): JsonResponse
    {
        $user = $request->user();

        if (config('services.billing_provider') === 'razorpay') {
            return response()->json([
                'message' => 'Self-service subscription management isn\'t available for Razorpay yet. Contact support to change or cancel your plan.',
            ], 501);
        }

        if (! $user->hasStripeId()) {
            return response()->json(['message' => 'No billing account found.'], 422);
        }

        $url = $user->billingPortalUrl(config('services.stripe.cancel_url'));

        return response()->json(['portal_url' => $url]);
    }

    // ── Stripe ───────────────────────────────────────────────────────────────

    private function stripeCheckout(User $user, ?int $planId = null): JsonResponse
    {
        if ($planId) {
            $plan    = \App\Models\Plan::find($planId);
            $priceId = $plan?->stripe_price_id;
        } else {
            $plan    = \App\Models\Plan::where('interval', 'month')->where('slug', '!=', 'free')->first();
            $priceId = $plan?->stripe_price_id ?? config('services.stripe.premium_price_id');
        }

        if (! $priceId) {
            return response()->json(['message' => 'Billing is not configured yet.'], 503);
        }

        $checkout = $user->newSubscription('default', $priceId)->checkout([
            'success_url' => config('services.stripe.success_url'),
            'cancel_url'  => config('services.stripe.cancel_url'),
        ]);

        return response()->json(['checkout_url' => $checkout->url]);
    }

    // ── Razorpay ─────────────────────────────────────────────────────────────

    private function razorpayCheckout(User $user, ?int $planId = null): JsonResponse
    {
        $key    = config('services.razorpay.key');
        $secret = config('services.razorpay.secret');

        if (! $key || ! $secret) {
            return response()->json(['message' => 'Razorpay is not configured yet. Add API keys in admin Settings → Razorpay.'], 503);
        }

        $plan = $planId
            ? \App\Models\Plan::find($planId)
            : \App\Models\Plan::where('interval', 'month')->where('slug', '!=', 'free')->first();

        $planIdRz = $plan?->razorpay_price_id;

        if (! $planIdRz) {
            return response()->json(['message' => 'Razorpay Plan ID not configured for this plan. Edit the plan in admin and add the Razorpay Price ID.'], 503);
        }

        $api = new RazorpayApi($key, $secret);

        $subscription = $api->subscription->create([
            'plan_id'         => $planIdRz,
            'customer_notify' => 1,
            'total_count'     => 12,
            'notes'           => ['user_id' => (string) $user->id],
        ]);

        $user->forceFill([
            'razorpay_subscription_id'     => $subscription->id,
            'razorpay_subscription_status' => $subscription->status,
        ])->save();

        return response()->json(['checkout_url' => $subscription->short_url]);
    }

    /**
     * Get the current user's subscription details (Stripe or Razorpay) + invoices.
     */
    public function subscriptionDetail(Request $request): JsonResponse
    {
        $user    = $request->user();
        $key     = config('services.razorpay.key');
        $secret  = config('services.razorpay.secret');
        $country = $request->input('country', 'US');

        $result = [
            'provider'     => null,
            'subscription' => null,
            'invoices'     => [],
        ];

        // Stripe subscription
        if ($user->hasStripeId() && config('cashier.secret')) {
            try {
                $stripe = new \Stripe\StripeClient(config('cashier.secret'));
                $subs   = $stripe->subscriptions->all([
                    'customer' => $user->stripe_id,
                    'limit'    => 1,
                ]);

                if (count($subs->data) > 0) {
                    $sub = $subs->data[0];
                    $result['provider'] = 'stripe';
                    $result['subscription'] = [
                        'id'         => $sub->id,
                        'status'     => $sub->status,
                        'current_period_end' => $sub->current_period_end,
                        'cancel_at_period_end' => $sub->cancel_at_period_end,
                        'plan'       => $sub->items->data[0]->plan->id ?? null,
                    ];

                    // Fetch recent invoices
                    $invoices = $stripe->invoices->all([
                        'customer' => $user->stripe_id,
                        'limit'    => 5,
                    ]);
                    $result['invoices'] = collect($invoices->data)->map(fn($inv) => [
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

        // Razorpay subscription
        if (! $result['provider'] && $user->razorpay_subscription_id && $key && $secret) {
            try {
                $api = new RazorpayApi($key, $secret);
                $subscription = $api->subscription->fetch($user->razorpay_subscription_id);

                $result['provider'] = 'razorpay';
                $result['subscription'] = [
                    'id'           => $subscription->id,
                    'status'       => $subscription->status,
                    'current_start' => $subscription->current_start,
                    'current_end'  => $subscription->current_end,
                    'charged_count' => $subscription->charged_count,
                    'total_count'  => $subscription->total_count,
                    'plan_id'      => $subscription->plan_id,
                ];

                // Fetch invoices
                $invoices = $api->invoice->all([
                    'subscription_id' => $user->razorpay_subscription_id,
                    'count'           => 5,
                ]);
                $result['invoices'] = collect($invoices->items ?? [])->map(fn($inv) => [
                    'id'         => $inv->id,
                    'invoice_id' => $inv->invoice_number ?? $inv->id,
                    'amount'     => $inv->amount,
                    'currency'   => $inv->currency,
                    'status'     => $inv->status,
                    'paid_at'    => $inv->paid_at,
                    'created_at' => $inv->created_at,
                    'pdf_url'    => $inv->short_url,
                ])->toArray();
            } catch (\Exception) {
                // Razorpay unreachable
            }
        }

        return response()->json($result);
    }
}
