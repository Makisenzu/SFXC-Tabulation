import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import axios from 'axios';

export default function SyncSettings({ auth }) {
    const [syncing, setSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState(null);
    const [config, setConfig] = useState({
        online_url: '',
        api_key: ''
    });

    const handleSync = async () => {
        if (!config.online_url || !config.api_key) {
            alert('Please enter both Online URL and API Key');
            return;
        }

        if (!confirm('Sync all data to online server? This will send all events, scores, and tallies.')) {
            return;
        }

        setSyncing(true);
        setSyncResult(null);

        try {
            const response = await axios.post('/sync-to-online', config);
            setSyncResult({
                success: true,
                message: response.data.message,
                stats: response.data.stats
            });
            localStorage.setItem('sync_config', JSON.stringify(config));
        } catch (error) {
            setSyncResult({
                success: false,
                message: error.response?.data?.message || 'Sync failed'
            });
        } finally {
            setSyncing(false);
        }
    };

    useState(() => {
        const saved = localStorage.getItem('sync_config');
        if (saved) {
            setConfig(JSON.parse(saved));
        }
    }, []);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Sync Settings" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sync to Online Server</h1>
                            <p className="text-gray-600">
                                Synchronize all local data (events, contestants, scores, tallies) to the online server
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Online Server URL
                                </label>
                                <input
                                    type="url"
                                    value={config.online_url}
                                    onChange={(e) => setConfig({ ...config, online_url: e.target.value })}
                                    placeholder="https://your-online-server.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="mt-1 text-sm text-gray-500">Enter the full URL of your online server</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    API Key
                                </label>
                                <input
                                    type="password"
                                    value={config.api_key}
                                    onChange={(e) => setConfig({ ...config, api_key: e.target.value })}
                                    placeholder="Enter your API key"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="mt-1 text-sm text-gray-500">Secure authentication key for the online server</p>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleSync}
                                    disabled={syncing}
                                    className={`w-full px-6 py-4 rounded-lg text-white font-semibold text-lg transition-colors ${
                                        syncing
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                >
                                    {syncing ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Syncing...
                                        </span>
                                    ) : (
                                        'Sync to Online Server'
                                    )}
                                </button>
                            </div>

                            {syncResult && (
                                <div className={`p-4 rounded-lg ${
                                    syncResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                                }`}>
                                    <div className={`font-semibold mb-2 ${
                                        syncResult.success ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                        {syncResult.success ? 'Sync Successful!' : 'Sync Failed'}
                                    </div>
                                    <div className={`text-sm ${
                                        syncResult.success ? 'text-green-700' : 'text-red-700'
                                    }`}>
                                        {syncResult.message}
                                    </div>
                                    {syncResult.stats && (
                                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                            <div className="text-green-700">Events: {syncResult.stats.events}</div>
                                            <div className="text-green-700">Contestants: {syncResult.stats.contestants}</div>
                                            <div className="text-green-700">Tallies: {syncResult.stats.tallies}</div>
                                            <div className="text-green-700">Scores: {syncResult.stats.scores}</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="font-semibold text-blue-900 mb-2">What will be synced?</h3>
                            <ul className="space-y-1 text-sm text-blue-800">
                                <li>• All events and their settings</li>
                                <li>• All contestants and participants</li>
                                <li>• Judge assignments and scores</li>
                                <li>• Medal tallies and results</li>
                                <li>• Criteria and rounds configuration</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
