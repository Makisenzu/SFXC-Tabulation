import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { FaMedal, FaArrowLeft, FaTrophy } from 'react-icons/fa';

export default function ArchivedMedalTallyDetails({ tally }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const getMedalStats = (participantId) => {
        const participantScores = tally.scores?.filter(s => s.participant_id === participantId) || [];
        const gold = participantScores.filter(s => s.score === 3).length;
        const silver = participantScores.filter(s => s.score === 2).length;
        const bronze = participantScores.filter(s => s.score === 1).length;
        const total = gold + silver + bronze;
        
        return { gold, silver, bronze, total };
    };

    const sortedParticipants = [...(tally.participants || [])].sort((a, b) => {
        const statsA = getMedalStats(a.id);
        const statsB = getMedalStats(b.id);
        
        if (statsB.gold !== statsA.gold) return statsB.gold - statsA.gold;
        if (statsB.silver !== statsA.silver) return statsB.silver - statsA.silver;
        if (statsB.bronze !== statsA.bronze) return statsB.bronze - statsA.bronze;
        return a.participant_name.localeCompare(b.participant_name);
    });

    return (
        <PublicLayout>
            <Head title={`${tally.tally_title} - Archived`} />
            
            <div className="py-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link 
                        href="/archived-medal-tallies"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                    >
                        <FaArrowLeft /> Back to Archived Tallies
                    </Link>

                    {/* Header */}
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-8 mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">{tally.tally_title}</h1>
                        <p className="text-gray-600 mb-6">
                            Archived on {formatDate(tally.archived_at)}
                        </p>
                        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                            <div>
                                <div className="text-gray-600 text-sm mb-1">Competitions</div>
                                <div className="text-3xl font-bold text-gray-900">{tally.events?.length || 0}</div>
                            </div>
                            <div>
                                <div className="text-gray-600 text-sm mb-1">Participants</div>
                                <div className="text-3xl font-bold text-gray-900">{tally.participants?.length || 0}</div>
                            </div>
                            <div>
                                <div className="text-gray-600 text-sm mb-1">Total Medals</div>
                                <div className="text-3xl font-bold text-gray-900">{tally.scores?.length || 0}</div>
                            </div>
                        </div>
                    </div>

                    {/* Overall Standings */}
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Overall Standings</h2>
                        <div className="space-y-3">
                            {sortedParticipants.map((participant, index) => {
                                const stats = getMedalStats(participant.id);
                                const isWinner = index === 0;
                                
                                return (
                                    <div 
                                        key={participant.id}
                                        className={`flex items-center justify-between p-4 rounded-lg border ${
                                            isWinner 
                                                ? 'bg-gray-50 border-gray-900 border-2' 
                                                : 'bg-white border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`text-2xl font-bold ${
                                                isWinner ? 'text-gray-900' : 'text-gray-400'
                                            }`}>
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className={`font-semibold ${
                                                    isWinner ? 'text-lg text-gray-900' : 'text-gray-900'
                                                }`}>
                                                    {participant.participant_name}
                                                    {isWinner && <FaTrophy className="inline ml-2 text-gray-900" />}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Total: {stats.total} medals
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-center">
                                                <FaMedal className="text-yellow-500 text-xl mx-auto" />
                                                <div className="font-bold text-gray-900">{stats.gold}</div>
                                            </div>
                                            <div className="text-center">
                                                <FaMedal className="text-gray-400 text-xl mx-auto" />
                                                <div className="font-bold text-gray-900">{stats.silver}</div>
                                            </div>
                                            <div className="text-center">
                                                <FaMedal className="text-orange-600 text-xl mx-auto" />
                                                <div className="font-bold text-gray-900">{stats.bronze}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Events List */}
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Competitions</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {tally.events?.map(event => {
                                const eventScores = tally.scores?.filter(s => s.event_id === event.id) || [];
                                
                                return (
                                    <Link
                                        key={event.id}
                                        href={`/archived-medal-tallies/${tally.id}/event/${event.id}`}
                                        className="bg-white rounded-lg p-5 hover:shadow-md transition-shadow border border-gray-200"
                                    >
                                        <h3 className="font-bold text-gray-900 mb-2 text-lg">{event.event_name}</h3>
                                        <div className="text-sm text-gray-600 mb-3">
                                            {formatDate(event.event_start)} - {formatDate(event.event_end)}
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                            <div className="flex items-center gap-2">
                                                <FaMedal className="text-gray-900" />
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {eventScores.length} medals
                                                </span>
                                            </div>
                                            <span className="text-gray-400">→</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
