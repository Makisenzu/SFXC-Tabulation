<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Console\Scheduling\Schedule;
use PhpParser\Node\Stmt\TraitUseAdaptation\Alias;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

        $middleware->alias([
            'role' => \App\Http\Middleware\CheckUserRole::class,
            'sync.api' => \App\Http\Middleware\VerifySyncApiKey::class,
        ]);
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'api/*',
            'api/sync/receive',
            '/api/sync/receive'
        ]);
    })
    ->withSchedule(function (Schedule $schedule) {
        // Run daily at midnight to update past events to inactive
        $schedule->command('events:update-past-status')->daily();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
