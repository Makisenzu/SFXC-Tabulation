import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import EventCriteriaTable from './components/CriteriaTable';

export default function CriteriaDashboard () {
        return (
            <AuthenticatedLayout 
                header={
                    <div className="flex items-center space-x-2">
                        <span>Events</span>
                    </div>
                } 
            >
                <Head title="Criteria Management" />
                <div className="py-6">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <EventCriteriaTable/>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
}