import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CriteriaDashboard () {
        return (
            <AuthenticatedLayout 
                header={
                    <div className="flex items-center space-x-2">
                        <span>Criteria Management</span>
                    </div>
                } 
            >
                <div className="py-6">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    </div>
                </div>
            </AuthenticatedLayout>
        );
}