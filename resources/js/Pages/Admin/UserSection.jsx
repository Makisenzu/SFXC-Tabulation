import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserTable from './components/UserTable';
import { Head } from '@inertiajs/react';
import { FaUsers } from 'react-icons/fa';

export default function UserSection({ auth }) {

    return (
        <AuthenticatedLayout 
            header={
                <div className="flex items-center space-x-2">
                    <FaUsers className="text-gray-600" />
                    <span>User Management</span>
                </div>
            } 
            auth={auth}
        >
            <Head title="SFXC Tabulation" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <UserTable
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}