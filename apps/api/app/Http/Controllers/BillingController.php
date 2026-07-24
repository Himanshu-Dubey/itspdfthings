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
}
