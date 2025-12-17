import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import SettingsPanel from './components/SettingsPanel';

export default function Settings() {
    return (
        <AuthenticatedLayout 
            header={
                <div className="flex items-center space-x-2">
                    <span>Application Settings</span>
                </div>
            } 
        >
            <Head title="Settings - SFXC Tabulation" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <SettingsPanel />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
