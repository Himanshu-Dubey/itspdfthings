<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class StripeConfigController extends Controller
{
    private const ENV_KEYS = [
        'STRIPE_KEY',
        'STRIPE_SECRET',
        'STRIPE_WEBHOOK_SECRET',
        'STRIPE_PRICE_PREMIUM_MONTHLY',
    ];

    /** Return current config status (values masked, never exposed in full). */
    public function index(): JsonResponse
    {
        $content = file_get_contents(base_path('.env'));
        $config  = [];

        foreach (self::ENV_KEYS as $key) {
            $value        = $this->readEnvValue($key, $content);
            $config[$key] = [
                'set'     => $value !== '',
                'preview' => $value !== '' ? $this->maskValue($key, $value) : null,
            ];
        }

        return response()->json([
            'config'      => $config,
            'webhook_url' => config('app.url') . '/api/stripe/webhook',
            'provider'    => config('services.billing_provider', 'stripe'),
        ]);
    }

    /** Write one or more Stripe env keys to .env and clear the config cache. */
    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'STRIPE_KEY'                   => ['nullable', 'string', 'max:500'],
            'STRIPE_SECRET'                => ['nullable', 'string', 'max:500'],
            'STRIPE_WEBHOOK_SECRET'        => ['nullable', 'string', 'max:500'],
            'STRIPE_PRICE_PREMIUM_MONTHLY' => ['nullable', 'string', 'max:500'],
        ]);

        $content = file_get_contents(base_path('.env'));

        foreach (self::ENV_KEYS as $key) {
            if (array_key_exists($key, $data)) {
                $content = $this->writeEnvValue($key, $data[$key] ?? '', $content);
            }
        }

        file_put_contents(base_path('.env'), $content);
        Artisan::call('config:clear');

        return $this->index();
    }

    /** Ping Stripe with the current secret key to verify credentials. */
    public function test(): JsonResponse
    {
        // Always read directly from file so a just-saved key is tested immediately.
        $content = file_get_contents(base_path('.env'));
        $secret  = $this->readEnvValue('STRIPE_SECRET', $content);

        if ($secret === '') {
            return response()->json(['ok' => false, 'message' => 'STRIPE_SECRET is not configured.']);
        }

        try {
            $stripe = new \Stripe\StripeClient($secret);
            $stripe->customers->all(['limit' => 1]);

            return response()->json(['ok' => true, 'message' => 'Connected to Stripe successfully.']);
        } catch (\Exception $e) {
            return response()->json(['ok' => false, 'message' => $e->getMessage()]);
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function readEnvValue(string $key, string $content): string
    {
        if (preg_match('/^' . preg_quote($key, '/') . '=(.*)$/m', $content, $m)) {
            return trim($m[1], '"\'');
        }

        return '';
    }

    private function writeEnvValue(string $key, string $value, string $content): string
    {
        $line = $value !== '' ? "{$key}={$value}" : "{$key}=";

        if (preg_match('/^' . preg_quote($key, '/') . '=/m', $content)) {
            return preg_replace('/^' . preg_quote($key, '/') . '=.*/m', $line, $content);
        }

        return $content . "\n{$line}";
    }

    private function maskValue(string $key, string $value): string
    {
        // Price IDs are not sensitive — show them in full.
        if ($key === 'STRIPE_PRICE_PREMIUM_MONTHLY') {
            return $value;
        }

        // For secrets/keys: show the recognisable prefix + last 4 chars.
        if (strlen($value) <= 12) {
            return str_repeat('*', strlen($value));
        }

        return substr($value, 0, 8) . '…' . substr($value, -4);
    }
}
