<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SubscriptionAdminController extends Controller
{
    public function index(): JsonResponse
    {
        // The `subscriptions` table is created by Laravel Cashier migrations.
        // Guard against early deploys where it may not exist yet.
        if (! Schema::hasTable('subscriptions')) {
            return response()->json(['subscriptions' => [], 'meta' => null, 'stripe_configured' => $this->stripeConfigured()]);
        }

        $rows = DB::table('subscriptions')
            ->join('users', 'subscriptions.user_id', '=', 'users.id')
            ->select([
                'subscriptions.id',
                'subscriptions.stripe_id',
                'subscriptions.stripe_status',
                'subscriptions.stripe_price',
                'subscriptions.ends_at',
                'subscriptions.created_at',
                'users.id as user_id',
                'users.name as user_name',
                'users.email as user_email',
                'users.plan as user_plan',
            ])
            ->orderByDesc('subscriptions.created_at')
            ->paginate(25);

        return response()->json([
            'subscriptions'    => $rows->items(),
            'meta'             => [
                'total'        => $rows->total(),
                'per_page'     => $rows->perPage(),
                'current_page' => $rows->currentPage(),
                'last_page'    => $rows->lastPage(),
            ],
            'stripe_configured' => $this->stripeConfigured(),
        ]);
    }

    public function metrics(): JsonResponse
    {
        $stripeConfigured = $this->stripeConfigured();

        if (! Schema::hasTable('subscriptions')) {
            return response()->json([
                'active'           => 0,
                'cancelled'        => 0,
                'premium_users'    => User::where('plan', 'premium')->count(),
                'stripe_configured' => $stripeConfigured,
            ]);
        }

        return response()->json([
            'active'            => DB::table('subscriptions')->where('stripe_status', 'active')->count(),
            'cancelled'         => DB::table('subscriptions')->where('stripe_status', 'canceled')->count(),
            'past_due'          => DB::table('subscriptions')->where('stripe_status', 'past_due')->count(),
            'premium_users'     => User::where('plan', 'premium')->count(),
            'stripe_configured' => $stripeConfigured,
        ]);
    }

    private function stripeConfigured(): bool
    {
        return ! empty(config('cashier.secret')) && ! empty(config('services.stripe.premium_price_id'));
    }
}
