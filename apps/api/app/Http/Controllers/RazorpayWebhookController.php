<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Razorpay\Api\Errors\SignatureVerificationError;
use Razorpay\Api\Utility;

class RazorpayWebhookController extends Controller
{
    /** Subscription statuses that mean the user should be treated as premium. */
    private const ACTIVE_STATUSES = ['active', 'authenticated', 'charged'];

    public function handleWebhook(Request $request): JsonResponse
    {
        $secret = config('services.razorpay.webhook_secret');

        if (! $secret) {
            Log::warning('Razorpay webhook received but RAZORPAY_WEBHOOK_SECRET is not set — ignoring.');

            return response()->json(['message' => 'Webhook not configured.'], 503);
        }

        $payload   = $request->getContent();
        $signature = $request->header('X-Razorpay-Signature', '');

        try {
            (new Utility())->verifyWebhookSignature($payload, $signature, $secret);
        } catch (SignatureVerificationError $e) {
            Log::warning('Razorpay webhook signature verification failed', ['error' => $e->getMessage()]);

            return response()->json(['message' => 'Invalid signature.'], 400);
        }

        $data  = $request->json()->all();
        $event = $data['event'] ?? null;

        $subscriptionEntity = $data['payload']['subscription']['entity'] ?? null;

        if ($subscriptionEntity) {
            $this->syncSubscription($subscriptionEntity['id'], $subscriptionEntity['status'] ?? null);
        }

        Log::info('Razorpay webhook handled', ['event' => $event]);

        return response()->json(['status' => 'ok']);
    }

    private function syncSubscription(string $subscriptionId, ?string $status): void
    {
        $user = User::where('razorpay_subscription_id', $subscriptionId)->first();

        if (! $user) {
            return;
        }

        $user->forceFill([
            'razorpay_subscription_status' => $status,
            'plan' => in_array($status, self::ACTIVE_STATUSES, true) ? 'premium' : 'free',
        ])->save();
    }
}
