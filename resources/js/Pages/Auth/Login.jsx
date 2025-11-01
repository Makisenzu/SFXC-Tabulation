import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Admin Login - SFXC Tabulation" />

            {status && (
                <div className="mb-6 rounded-md bg-green-50 border border-green-200 p-4">
                    <p className="text-sm font-medium text-green-800">
                        {status}
                    </p>
                </div>
            )}

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Admin Portal</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Sign in to access the tabulation system
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel 
                        htmlFor="username" 
                        value="Username" 
                        className="text-sm font-medium text-gray-900"
                    />
                    <TextInput
                        id="username"
                        type="text"
                        name="username"
                        value={data.username}
                        className="mt-1.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('username', e.target.value)}
                        placeholder="Enter your username"
                    />
                    <InputError message={errors.username} className="mt-2" />
                </div>

                <div>
                    <InputLabel 
                        htmlFor="password" 
                        value="Password" 
                        className="text-sm font-medium text-gray-900"
                    />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Enter your password"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-gray-700">
                            Remember me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {processing ? 'Signing in...' : 'Sign in'}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}