import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Table from './components/Table';
import JudgeLayout from '@/Layouts/JudgeLayout';
import { useState } from 'react';

export default function JudgeDashboard() {
    const [selectedContestant, setSelectedContestant] = useState(null);

    return (
        <JudgeLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Judge Dashboard
                </h2>
            }
            selectedContestant={selectedContestant}
            onContestantSelect={setSelectedContestant}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* <Table 
                                selectedContestant={selectedContestant}
                                onContestantSelect={setSelectedContestant}
                            /> */}
                        </div>
                    </div>
                </div>
            </div>
        </JudgeLayout>
    );
}