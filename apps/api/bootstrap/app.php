<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware(['api', \Illuminate\Session\Middleware\StartSession::class, \Illuminate\Cookie\Middleware\EncryptCookies::class, \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class])
                ->prefix('api/admin')
                ->group(base_path('routes/admin.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Sanctum SPA stateful middleware — must come before auth checks.
        $middleware->statefulApi();

        // CORS must run before any auth/response middleware.
        $middleware->prepend(\Illuminate\Http\Middleware\HandleCors::class);

        // Alias for admin route protection.
        $middleware->alias([
            'auth.admin' => \App\Http\Middleware\EnsureAdminAuthenticated::class,
        ]);

        // API-only app: never redirect unauthenticated requests, always 401 JSON.
        $middleware->redirectGuestsTo(fn () => null);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Always return JSON for API routes.
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
