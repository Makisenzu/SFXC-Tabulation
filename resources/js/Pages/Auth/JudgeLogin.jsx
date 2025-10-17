import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
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
            <Head title="Log in" />

            {status && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-100 text-sm text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel 
                        htmlFor="email" 
                        value="Username" 
                        className="text-white font-medium drop-shadow-sm"
                    />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full bg-white/90 border-white/20 focus:border-white/40 focus:ring-white/20 text-gray-800 placeholder-gray-500"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Enter judge username"
                    />
                    <InputError message={errors.email} className="mt-2 text-white drop-shadow-sm" />
                </div>

                <div className="mt-4 hidden">
                    <InputLabel 
                        htmlFor="password" 
                        value="Password" 
                        className="text-white font-medium drop-shadow-sm"
                    />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2 block w-full bg-white/90 border-white/20 focus:border-white/40 focus:ring-white/20 text-gray-800 placeholder-gray-500"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Enter your password"
                    />
                    <InputError message={errors.password} className="mt-2 text-white drop-shadow-sm" />
                </div>

                <div className="mt-6 flex items-center justify-between">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-white/80 underline hover:text-white transition-colors duration-200 drop-shadow-sm"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton 
                        className="ms-4 bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-sm transition-all duration-200 transform hover:scale-105"
                        disabled={processing}
                    >
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}