import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserTable from './components/UserTable';
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
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <UserTable 
                            searchTerm={searchTerm}
                            roleFilter={roleFilter}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}