import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ArchivedMedalTable from './components/ArchivedMedalTable';

export default function ArchivedMedalTallies() {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-2">
                    <span>Archived Medal Tallies</span>
                </div>
            }
        >
            <Head title="Archived Medal Tallies - SFXC Tabulation" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <ArchivedMedalTable />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
