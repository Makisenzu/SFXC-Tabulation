import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function FacilitatorLogin({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '12345678', 
        login_type: 'facilitator',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Facilitator Login - SFXC Tabulation" />

            {status && (
                <div className="mb-6 rounded-md bg-green-50 border border-green-200 p-4">
                    <p className="text-sm font-medium text-green-800">
                        {status}
                    </p>
                </div>
            )}

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Facilitator Portal</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Login to access medal tally scoring
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel 
                        htmlFor="username" 
                        value="Facilitator Username" 
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
                        placeholder="Enter your facilitator username"
                        required
                    />
                    <InputError message={errors.username} className="mt-2" />
                </div>

                <input type="hidden" name="password" value={data.password} />
                <input type="hidden" name="login_type" value={data.login_type} />

                <div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {processing ? 'Signing in...' : 'Access Facilitator Panel'}
                    </button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                        For assistance, please contact the tabulation administrator
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
