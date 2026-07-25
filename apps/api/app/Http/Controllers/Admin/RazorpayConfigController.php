<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class RazorpayConfigController extends Controller
{
    private const SETTING_KEYS = [
        'RAZORPAY_KEY'            => 'razorpay_key',
        'RAZORPAY_SECRET'         => 'razorpay_secret',
        'RAZORPAY_WEBHOOK_SECRET' => 'razorpay_webhook_secret',
    ];

    public function index(): JsonResponse
    {
        $config = [];

        foreach (self::SETTING_KEYS as $envKey => $settingKey) {
            $value = Setting::get($settingKey, '');
            $config[$envKey] = [
                'set'     => $value !== '',
                'preview' => $value !== '' ? $this->maskValue($value) : null,
            ];
        }

        return response()->json([
            'config'      => $config,
            'webhook_url' => config('app.url') . '/api/razorpay/webhook',
            'provider'    => config('services.billing_provider', 'stripe'),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'RAZORPAY_KEY'            => ['nullable', 'string', 'max:500'],
            'RAZORPAY_SECRET'         => ['nullable', 'string', 'max:500'],
            'RAZORPAY_WEBHOOK_SECRET' => ['nullable', 'string', 'max:500'],
        ]);

        foreach (self::SETTING_KEYS as $envKey => $settingKey) {
            if (array_key_exists($envKey, $data)) {
                $value = $data[$envKey] ?? '';
                Setting::set($settingKey, $value);

                // Also update in-memory config so it takes effect immediately.
                Config::set("services.razorpay." . str_replace('razorpay_', '', $settingKey), $value);
            }
        }

        return $this->index();
    }

    public function test(): JsonResponse
    {
        $key    = config('services.razorpay.key', '');
        $secret = config('services.razorpay.secret', '');

        if ($key === '' || $secret === '') {
            return response()->json(['ok' => false, 'message' => 'RAZORPAY_KEY and RAZORPAY_SECRET must be configured.']);
        }

        try {
            $razorpay = new \Razorpay\Api\Api($key, $secret);
            $razorpay->plan->all(['count' => 1]);

            return response()->json(['ok' => true, 'message' => 'Connected to Razorpay successfully.']);
        } catch (\Throwable $e) {
            return response()->json(['ok' => false, 'message' => $e->getMessage()]);
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function maskValue(string $value): string
    {
        if (strlen($value) <= 12) {
            return str_repeat('*', strlen($value));
        }

        return substr($value, 0, 8) . '…' . substr($value, -4);
    }
}
