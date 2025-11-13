<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\AuthenticateWithCookie;
use Dotenv\Dotenv;

// Manually upload the .env
$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        api: __DIR__.'/../routes/api.php',
        apiPrefix: ($_ENV['APP_ENV'] ?? 'production') === 'production' ? 'substitutions/api' : '/api',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append(AuthenticateWithCookie::class);
        $middleware->alias([
            'cookie.auth' => AuthenticateWithCookie::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
