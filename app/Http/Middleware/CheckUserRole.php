<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        // Check if user is authenticated
        if (!$user) {
            abort(401, 'Unauthenticated');
        }

        // Load the role relationship (make sure your User model has this relationship)
        $user->load('role');

        // Check if user has one of the required roles
        if (!in_array($user->role->role_name, $roles)) {
            abort(403, 'Access Denied. Required roles: ' . implode(', ', $roles));
        }

        return $next($request);
    }
}