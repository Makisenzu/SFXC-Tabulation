import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ArchiveTable from './components/ArchiveTable';

export default function ArchiveDashboard() {
    return (
        <AuthenticatedLayout 
            header={
                <div className="flex items-center space-x-2">
                    <span>Archived Events</span>
                </div>
            } 
        >
            <Head title="Archived Events - SFXC Tabulation" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <ArchiveTable />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
