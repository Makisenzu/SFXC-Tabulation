<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use App\Models\Event;
use App\Models\Contestant;
use App\Models\Criteria;
use App\Models\Active;
use App\Models\Round;
use App\Models\Tabulation;
use App\Models\User;
use App\Models\Assign;
use App\Models\MedalTally;
use App\Models\MedalTallyParticipant;
use App\Models\MedalScore;

class SyncController extends Controller
{
    public function syncToOnline(Request $request)
    {
        $validated = $request->validate([
            'online_url' => 'required|url',
            'api_key' => 'required|string'
        ]);

        $onlineUrl = rtrim($validated['online_url'], '/');
        $apiKey = $validated['api_key'];

        try {
            DB::beginTransaction();

            $syncData = $this->prepareAllData();

            // Send data to online server
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Accept' => 'application/json',
            ])->timeout(120)->post($onlineUrl . '/api/sync/receive', [
                'data' => $syncData
            ]);

            if ($response->successful()) {
                DB::commit();
                return response()->json([
                    'success' => true,
                    'message' => 'Data synced successfully to online server',
                    'synced_at' => now()->toISOString(),
                    'stats' => [
                        'events' => count($syncData['events']),
                        'contestants' => count($syncData['contestants']),
                        'tallies' => count($syncData['medal_tallies']),
                        'scores' => count($syncData['tabulations'])
                    ]
                ]);
            } else {
                throw new \Exception('Online server returned error: ' . $response->body());
            }

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Sync failed: ' . $e->getMessage()
            ], 500);
        }
    }

    private function prepareAllData()
    {
        return [
            'events' => Event::all()->toArray(),
            'contestants' => Contestant::all()->toArray(),
            'criteria' => Criteria::all()->toArray(),
            'actives' => Active::all()->toArray(),
            'rounds' => Round::all()->toArray(),
            'tabulations' => Tabulation::all()->toArray(),
            'users' => User::where('role_id', 2)->get()->toArray(), // Only judges
            'assigns' => Assign::all()->toArray(),
            'medal_tallies' => MedalTally::all()->toArray(),
            'medal_participants' => MedalTallyParticipant::all()->toArray(),
            'medal_scores' => MedalScore::all()->toArray(),
        ];
    }

    public function receiveSyncData(Request $request)
    {
        $validated = $request->validate([
            'data' => 'required|array'
        ]);

        try {
            DB::beginTransaction();

            $data = $validated['data'];

            // STEP 1: Sync parent tables first (no dependencies)
            
            // Sync Events (must be first - parent to many tables)
            foreach ($data['events'] ?? [] as $event) {
                Event::updateOrCreate(
                    ['id' => $event['id']],
                    $event
                );
            }

            // Sync Judges (must be before assignments)
            foreach ($data['users'] ?? [] as $user) {
                User::updateOrCreate(
                    ['id' => $user['id']],
                    $user
                );
            }

            // Sync Medal Tallies (must be before participants)
            foreach ($data['medal_tallies'] ?? [] as $tally) {
                MedalTally::updateOrCreate(
                    ['id' => $tally['id']],
                    $tally
                );
            }

            // STEP 2: Sync child tables (depend on events)
            
            // Sync Contestants (depends on events)
            foreach ($data['contestants'] ?? [] as $contestant) {
                Contestant::updateOrCreate(
                    ['id' => $contestant['id']],
                    $contestant
                );
            }

            // Sync Criteria (depends on events)
            foreach ($data['criteria'] ?? [] as $criteria) {
                Criteria::updateOrCreate(
                    ['id' => $criteria['id']],
                    $criteria
                );
            }

            // Sync Rounds (depends on events)
            foreach ($data['rounds'] ?? [] as $round) {
                Round::updateOrCreate(
                    ['id' => $round['id']],
                    $round
                );
            }

            // Sync Actives (depends on events and rounds)
            foreach ($data['actives'] ?? [] as $active) {
                Active::updateOrCreate(
                    ['id' => $active['id']],
                    $active
                );
            }

            // STEP 3: Sync relationship tables (depend on multiple tables)
            
            // Sync Judge Assignments (depends on events and users)
            foreach ($data['assigns'] ?? [] as $assign) {
                Assign::updateOrCreate(
                    ['id' => $assign['id']],
                    $assign
                );
            }

            // Sync Tabulations (depends on events, contestants, criteria, users)
            foreach ($data['tabulations'] ?? [] as $tabulation) {
                Tabulation::updateOrCreate(
                    ['id' => $tabulation['id']],
                    $tabulation
                );
            }

            // Sync Medal Participants (depends on medal_tallies and contestants)
            foreach ($data['medal_participants'] ?? [] as $participant) {
                MedalTallyParticipant::updateOrCreate(
                    ['id' => $participant['id']],
                    $participant
                );
            }

            // Sync Medal Scores (depends on medal_tallies and contestants)
            foreach ($data['medal_scores'] ?? [] as $score) {
                MedalScore::updateOrCreate(
                    ['id' => $score['id']],
                    $score
                );
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data received and synced successfully',
                'synced_at' => now()->toISOString()
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Sync failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getSyncStatus()
    {
        return response()->json([
            'local_stats' => [
                'events' => Event::count(),
                'contestants' => Contestant::count(),
                'judges' => User::where('role_id', 2)->count(),
                'tabulations' => Tabulation::count(),
                'medal_tallies' => MedalTally::count(),
            ],
            'last_sync' => cache('last_sync_time'),
        ]);
    }
}
