import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ScoreTables from './components/ScoreTables';

export default function AdminDashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white-800">
                    Admin
                </h2>
            }
        >
            <Head title="SFXC Tabulation" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <ScoreTables/>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
