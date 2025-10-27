import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ContestantTable from './components/Contestants';
export default function ContestantDashboard () {
        return (
            <AuthenticatedLayout 
                header={
                    <div className="flex items-center space-x-2">
                        <span>Contestant Management</span>
                    </div>
                } 
            >
                <Head title="SFXC Tabulation" />
                <div className="py-6">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <ContestantTable/>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
}