<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
            'login_type' => ['sometimes', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $credentials = $this->only('username', 'password');
        $loginType = $this->input('login_type');
        
        if ($loginType === 'judge') {
            $this->authenticateJudge($credentials);
        } elseif ($loginType === 'facilitator') {
            $this->authenticateFacilitator($credentials);
        } else {
            $this->authenticateAdmin($credentials);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Handle judge authentication with static password
     */
    protected function authenticateJudge(array $credentials): void
    {
        $staticPassword = '12345678';
        
        if ($credentials['password'] !== $staticPassword) {
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'username' => 'Invalid judge credentials',
            ]);
        }

        $user = User::where('username', $credentials['username'])
                    ->with('role')
                    ->first();

        if (!$user) {
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'username' => 'Judge account not found',
            ]);
        }

        if ($user->is_active !== 1) {
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'username' => 'This judge is not available',
            ]);
        }

        if ($user->role->role_name !== 'Judge') {
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'username' => 'This account is not authorized as judge',
            ]);
        }

        Auth::login($user, $this->boolean('remember'));
    }

    /**
     * Handle facilitator authentication with static password
     */
    protected function authenticateFacilitator(array $credentials): void
    {
        $staticPassword = '12345678';
        
        if ($credentials['password'] !== $staticPassword) {
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'username' => 'Invalid facilitator credentials',
            ]);
        }

        $user = User::where('username', $credentials['username'])
                    ->with('role')
                    ->first();

        if (!$user) {
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'username' => 'Facilitator account not found',
            ]);
        }

        if ($user->is_active !== 1) {
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'username' => 'This facilitator is not available',
            ]);
        }

        if ($user->role->role_name !== 'Facilitator') {
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'username' => 'This account is not authorized as facilitator',
            ]);
        }

        Auth::login($user, $this->boolean('remember'));
    }

    /**
     * Handle regular admin authentication with database password
     */
    protected function authenticateAdmin(array $credentials): void
    {
        if (! Auth::attempt($credentials, $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'username' => __('auth.failed'),
            ]);
        }

        $user = Auth::user();
        if ($user->is_active !== 1) {
            Auth::logout();
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'username' => 'This account is not active',
            ]);
        }
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'username' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('username')).'|'.$this->ip());
    }
}