<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PdfJobController;
use App\Http\Controllers\PlansController;
use App\Http\Controllers\RazorpayWebhookController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\PagePublicController;
use App\Http\Controllers\SeoController;
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
| Public SEO data
|--------------------------------------------------------------------------
| Returns all SEO metadata for the web app to consume.
*/
Route::get('/seo', [SeoController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Public pages (static content)
|--------------------------------------------------------------------------
*/
Route::get('/pages/navigation', [PagePublicController::class, 'navigation']);
Route::get('/pages/{slug}', [PagePublicController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Contact form (public — saves lead to database)
|--------------------------------------------------------------------------
*/
Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:5,1');

/*
|--------------------------------------------------------------------------
| Plans (public — no auth required)
|--------------------------------------------------------------------------
*/
Route::get('/plans', [PlansController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Blog (public — no auth required)
|--------------------------------------------------------------------------
*/
Route::get('/blog', [BlogController::class, 'index']);
Route::get('/blog/{slug}', [BlogController::class, 'show']);
Route::post('/blog/{id}/comments', [BlogController::class, 'submitComment'])->middleware('throttle:3,1');

/*
|--------------------------------------------------------------------------
| Uploaded files — serves images from storage/app/public/
|--------------------------------------------------------------------------
*/
Route::get('/files/{path}', function (string $path) {
    $full = realpath(storage_path('app/public') . DIRECTORY_SEPARATOR . $path);
    if (!$full || !file_exists($full)) abort(404);
    $mime = mime_content_type($full);
    return response()->file($full, [
        'Content-Type'  => $mime,
        'Cache-Control' => 'public, max-age=31536000, immutable',
    ]);
})->where('path', '.*');

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
    // Local dev: default to India so INR pricing works during development
    if (app()->environment('local')) {
        return response()->json([
            'country' => 'IN',
            'is_india' => true,
            'billing_provider' => 'razorpay',
        ]);
    }

    // Use CF-Connecting-IP when behind Cloudflare, fallback to X-Forwarded-For, then remote addr
    $ip = request()->header('CF-Connecting-IP')
        ?? request()->header('X-Forwarded-For')
        ?? request()->ip();

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
