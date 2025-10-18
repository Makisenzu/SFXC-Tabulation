import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function JudgeLogin({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '12345678', 
        login_type: 'judge',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Judge Login" />

            {status && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-100 text-sm text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel 
                        htmlFor="username" 
                        value="Judge Username" 
                        className="text-white font-medium drop-shadow-sm"
                    />
                    <TextInput
                        id="username"
                        type="text"
                        name="username"
                        value={data.username}
                        className="mt-2 block w-full bg-white/90 border-white/20 focus:border-white/40 focus:ring-white/20 text-gray-800 placeholder-gray-500"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('username', e.target.value)}
                        placeholder="Enter judge username"
                        required
                    />
                    <InputError message={errors.username} className="mt-2 text-white drop-shadow-sm" />
                </div>

                <input type="hidden" name="password" value={data.password} />
                <input type="hidden" name="login_type" value={data.login_type} />

                <div className="mt-6 flex items-center justify-end">
                    <PrimaryButton 
                        className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-white backdrop-blur-sm transition-all duration-200 transform hover:scale-105"
                        disabled={processing}
                    >
                        {processing ? 'Logging in...' : 'Judge Login'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}