<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class RazorpayConfigController extends Controller
{
    private const ENV_KEYS = [
        'RAZORPAY_KEY',
        'RAZORPAY_SECRET',
        'RAZORPAY_WEBHOOK_SECRET',
    ];

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

    public function test(): JsonResponse
    {
        $content = file_get_contents(base_path('.env'));
        $key     = $this->readEnvValue('RAZORPAY_KEY', $content);
        $secret  = $this->readEnvValue('RAZORPAY_SECRET', $content);

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
        if (strlen($value) <= 12) {
            return str_repeat('*', strlen($value));
        }

        return substr($value, 0, 8) . '…' . substr($value, -4);
    }
}
