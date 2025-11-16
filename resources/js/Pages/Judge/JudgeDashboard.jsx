import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Table from './components/Table';
import JudgeLayout from '@/Layouts/JudgeLayout';
import { useState, useCallback } from 'react';

export default function JudgeDashboard() {
    const [selectedContestant, setSelectedContestant] = useState(null);

    const handleContestantSelect = useCallback((contestant) => {
        setSelectedContestant(contestant);
    }, []);

    return (
        <JudgeLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white-800">
                </h2>
            }
            selectedContestant={selectedContestant}
            onContestantSelect={handleContestantSelect}
        >
            <Head title="Dashboard" />

            <div className="py-5">
            <Table 
                                selectedContestant={selectedContestant}
                            />
            </div>
        </JudgeLayout>
    );
}