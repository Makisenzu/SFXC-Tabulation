import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import MedalTable from './components/MedalTable';

export default function MedalDashboard() {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-2">
                    <span>Medal Tally Management</span>
                </div>
            }
        >
            <Head title="Medal Tally - SFXC Tabulation" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <MedalTable />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
