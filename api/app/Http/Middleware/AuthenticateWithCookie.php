<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AuthenticateWithCookie
{
    public function handle(Request $request, Closure $next)
    {
        // Allow email verification routes to proceed without token from cookie
        if ($request->is('api/email/verify/*')) {
            return $next($request);
        }

        // If there's no Authorization header but there's a token cookie, set the header
        if (!$request->bearerToken() && $request->cookie('token')) {
            $request->headers->set('Authorization', 'Bearer ' . $request->cookie('token'));
        }
        
        return $next($request);
    }
}