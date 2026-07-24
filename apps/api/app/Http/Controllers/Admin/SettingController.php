<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SettingController extends Controller
{
    public function billingIndex(): JsonResponse
    {
        $stripeEnabled = DB::table('settings')->where('key', 'stripe_enabled')->value('value');

        return response()->json([
            'stripe_enabled' => $stripeEnabled === '1' || $stripeEnabled === 'true',
        ]);
    }

    public function billingUpdate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'stripe_enabled' => 'required|boolean',
        ]);

        DB::table('settings')->updateOrInsert(
            ['key' => 'stripe_enabled'],
            [
                'value'       => $validated['stripe_enabled'] ? '1' : '0',
                'type'        => 'boolean',
                'group'       => 'billing',
                'description' => 'Enable Stripe payments (when off, Razorpay-only with INR pricing)',
                'updated_at'  => now(),
                'created_at'  => now(),
            ]
        );

        return response()->json([
            'message'        => 'Billing settings updated.',
            'stripe_enabled' => $validated['stripe_enabled'],
        ]);
    }
}
