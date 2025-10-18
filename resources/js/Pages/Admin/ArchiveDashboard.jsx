import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
export default function ArchiveDashboard () {
        return (
            <AuthenticatedLayout 
                header={
                    <div className="flex items-center space-x-2">
                        <span>Archived Events</span>
                    </div>
                } 
            >
                <Head title="Archived Events" />
                <div className="py-6">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    </div>
                </div>
            </AuthenticatedLayout>
        );
}