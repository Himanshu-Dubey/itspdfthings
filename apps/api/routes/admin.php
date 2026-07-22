<?php

use App\Http\Controllers\Admin\AbuseController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\JobsAdminController;
use App\Http\Controllers\Admin\PlanController;
use App\Http\Controllers\Admin\SeoController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\StripeConfigController;
use App\Http\Controllers\Admin\SubscriptionAdminController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

// ── Public ────────────────────────────────────────────────────────────────────
Route::post('auth/login', [AuthController::class, 'login']);

// ── Protected ─────────────────────────────────────────────────────────────────
Route::middleware('auth.admin')->group(function () {

    // Auth
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/user',    [AuthController::class, 'user']);

    // Dashboard
    Route::get('dashboard/metrics',       [DashboardController::class, 'metrics']);
    Route::get('dashboard/queue-status',  [DashboardController::class, 'queueStatus']);
    Route::get('dashboard/system-health', [DashboardController::class, 'systemHealth']);

    // Users
    Route::get('users',         [UserController::class, 'index']);
    Route::get('users/{id}',    [UserController::class, 'show']);
    Route::patch('users/{id}',  [UserController::class, 'update']);
    Route::delete('users/{id}', [UserController::class, 'destroy']);

    // Settings
    Route::get('settings',   [SettingsController::class, 'index']);
    Route::patch('settings', [SettingsController::class, 'update']);

    // Jobs admin (PDF jobs + failed queue)
    Route::get('jobs',                          [JobsAdminController::class, 'index']);
    Route::get('jobs/stats',                    [JobsAdminController::class, 'stats']);
    Route::post('jobs/cleanup',                 [JobsAdminController::class, 'cleanup']);
    Route::get('jobs/failed-queue',             [JobsAdminController::class, 'failedQueue']);
    Route::post('jobs/failed-queue/{id}/retry', [JobsAdminController::class, 'retryFailed']);
    Route::delete('jobs/failed-queue/{id}',     [JobsAdminController::class, 'deleteFailed']);

    // Abuse & moderation
    Route::get('abuse/logs',            [AbuseController::class, 'logs']);
    Route::get('abuse/blocklist',       [AbuseController::class, 'blocklist']);
    Route::post('abuse/blocklist',      [AbuseController::class, 'blockIp']);
    Route::delete('abuse/blocklist/{id}', [AbuseController::class, 'unblockIp']);

    // Audit log (read-only)
    Route::get('audit-log', [AuditLogController::class, 'index']);

    // Stripe configuration
    Route::get('stripe/config',   [StripeConfigController::class, 'index']);
    Route::patch('stripe/config', [StripeConfigController::class, 'update']);
    Route::post('stripe/test',    [StripeConfigController::class, 'test']);

    // Razorpay configuration
    Route::get('razorpay/config',   [\App\Http\Controllers\Admin\RazorpayConfigController::class, 'index']);
    Route::patch('razorpay/config', [\App\Http\Controllers\Admin\RazorpayConfigController::class, 'update']);
    Route::post('razorpay/test',    [\App\Http\Controllers\Admin\RazorpayConfigController::class, 'test']);

    // Subscriptions (Cashier data)
    Route::get('subscriptions',         [SubscriptionAdminController::class, 'index']);
    Route::get('subscriptions/metrics', [SubscriptionAdminController::class, 'metrics']);

    // Plans management
    Route::get('plans',          [PlanController::class, 'index']);
    Route::post('plans',         [PlanController::class, 'store']);
    Route::patch('plans/{id}',   [PlanController::class, 'update']);
    Route::delete('plans/{id}',  [PlanController::class, 'destroy']);

    // Pages (static content)
    Route::get('pages',          [\App\Http\Controllers\Admin\PageController::class, 'index']);
    Route::post('pages',         [\App\Http\Controllers\Admin\PageController::class, 'store']);
    Route::get('pages/{id}',     [\App\Http\Controllers\Admin\PageController::class, 'show']);
    Route::patch('pages/{id}',   [\App\Http\Controllers\Admin\PageController::class, 'update']);
    Route::delete('pages/{id}',  [\App\Http\Controllers\Admin\PageController::class, 'destroy']);

    // SEO
    Route::get('seo',          [SeoController::class, 'index']);
    Route::patch('seo',        [SeoController::class, 'update']);
    Route::post('seo/upload-og', [SeoController::class, 'uploadOg']);
});
