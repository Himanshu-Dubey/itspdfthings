<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\PdfJobController;
use App\Http\Controllers\PlansController;
use App\Http\Controllers\RazorpayWebhookController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\ToolStatusController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Auth routes
|--------------------------------------------------------------------------
| These hit Sanctum's SPA CSRF cookie first, then the auth endpoints.
*/
Route::post('/auth/register', [AuthController::class, 'register'])->middleware('guest');
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('guest');
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/auth/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
Route::patch('/auth/profile', [AuthController::class, 'updateProfile'])->middleware('auth:sanctum');

/*
|--------------------------------------------------------------------------
| Job routes
|--------------------------------------------------------------------------
| POST /api/jobs  — upload a file and enqueue a job (anonymous allowed).
| GET  /api/jobs/{id} — poll for status / get signed download URL.
*/
Route::post('/jobs', [PdfJobController::class, 'store'])
    ->middleware(['throttle:uploads']);

Route::get('/jobs', [PdfJobController::class, 'index'])->middleware('auth:sanctum');
Route::get('/jobs/{id}', [PdfJobController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Public tool status
|--------------------------------------------------------------------------
| Read by the frontend to hide disabled tools and show maintenance/
| announcement banners, without a deploy.
*/
Route::get('/tools/status', [ToolStatusController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Plans (public — no auth required)
|--------------------------------------------------------------------------
*/
Route::get('/plans', [PlansController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Billing (Stripe Checkout + Cashier, or Razorpay Subscriptions)
|--------------------------------------------------------------------------
| Checkout/portal require a logged-in user and branch internally on
| services.billing_provider. Both webhooks are signature-verified by the
| respective SDK — they're called by Stripe/Razorpay's servers, not Sanctum.
*/
Route::middleware('auth:sanctum')->prefix('billing')->group(function () {
    Route::post('/checkout', [BillingController::class, 'checkout']);
    Route::get('/portal',    [BillingController::class, 'portal']);
    Route::post('/sync',     [BillingController::class, 'sync']);
});

Route::post('/stripe/webhook', [StripeWebhookController::class, 'handleWebhook']);

Route::post('/razorpay/webhook', [RazorpayWebhookController::class, 'handleWebhook']);

/*
|--------------------------------------------------------------------------
| Geo detection (returns user's country from IP — used for billing routing)
|--------------------------------------------------------------------------
*/
Route::get('/geo', function () {
    $ip = request()->ip();
    // In production, use a GeoIP service. For now, use a free API.
    $ch = curl_init("http://ip-api.com/json/{$ip}?fields=countryCode");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 2);
    $data = json_decode(curl_exec($ch), true);
    curl_close($ch);

    $country = $data['countryCode'] ?? 'US';

    return response()->json([
        'country' => $country,
        'is_india' => $country === 'IN',
        'billing_provider' => $country === 'IN' ? 'razorpay' : 'stripe',
    ]);
});
