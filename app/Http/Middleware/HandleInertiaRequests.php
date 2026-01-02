<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  callable  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, $next)
    {
        // Skip Inertia middleware for API routes
        if ($request->is('api/*')) {
            return $next($request);
        }

        return parent::handle($request, $next);
    }

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'appEnv' => config('app.env'),
            'appLogo' => $this->getAppLogo(),
        ];
    }

    /**
     * Get the application logo path
     */
    private function getAppLogo(): ?string
    {
        $extensions = ['png', 'jpg', 'jpeg', 'gif'];
        
        foreach ($extensions as $ext) {
            $path = 'logos/app-logo.' . $ext;
            if (\Storage::disk('public')->exists($path)) {
                return $path;
            }
        }

        return null;
    }
}
