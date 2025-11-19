<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use App\Models\Round;
use App\Models\Active;
use App\Models\Assign;
use App\Models\Criteria;
use App\Models\Contestant;
use App\Models\MedalScore;
use App\Models\MedalTally;
use App\Models\Tabulation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use App\Models\MedalTallyParticipant;

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
            
            Log::info('Receiving sync data', [
                'event_count' => count($data['events'] ?? []),
                'contestant_count' => count($data['contestants'] ?? []),
                'user_count' => count($data['users'] ?? [])
            ]);

            // STEP 1: Sync parent tables first (no dependencies)
            
            // Sync Events (must be first - parent to many tables)
            foreach ($data['events'] ?? [] as $event) {
                Event::updateOrCreate(
                    ['id' => $event['id']],
                    $event
                );
            }

            // STEP 2: Sync Actives (depends on events) - BEFORE criteria and rounds
            foreach ($data['actives'] ?? [] as $active) {
                Active::updateOrCreate(
                    ['id' => $active['id']],
                    $active
                );
            }

            // STEP 3: Sync Users (skip existing judges)
            foreach ($data['users'] ?? [] as $user) {
                // Check if user exists by username
                $existingUser = User::where('username', $user['username'])->first();
                
                if (!$existingUser) {
                    // Only create new users, don't update existing judges
                    try {
                        User::create($user);
                    } catch (\Exception $e) {
                        Log::warning('User creation skipped', ['username' => $user['username']]);
                    }
                }
            }

            // Sync Medal Tallies (must be before participants)
            foreach ($data['medal_tallies'] ?? [] as $tally) {
                MedalTally::updateOrCreate(
                    ['id' => $tally['id']],
                    $tally
                );
            }

            // STEP 4: Sync child tables (depend on events)
            
            // Sync Contestants (depends on events)
            foreach ($data['contestants'] ?? [] as $contestant) {
                Contestant::updateOrCreate(
                    ['id' => $contestant['id']],
                    $contestant
                );
            }

            // Sync Criteria (depends on events and actives)
            foreach ($data['criteria'] ?? [] as $criteria) {
                Criteria::updateOrCreate(
                    ['id' => $criteria['id']],
                    $criteria
                );
            }

            // Sync Rounds (depends on contestants and actives)
            foreach ($data['rounds'] ?? [] as $round) {
                Round::updateOrCreate(
                    ['id' => $round['id']],
                    $round
                );
            }

            // STEP 5: Sync relationship tables (depend on multiple tables)
            
            // Sync Judge Assignments (depends on events and users)
            foreach ($data['assigns'] ?? [] as $assign) {
                try {
                    Assign::updateOrCreate(
                        ['id' => $assign['id']],
                        $assign
                    );
                } catch (\Exception $e) {
                    Log::warning('Assign sync skipped', ['assign_id' => $assign['id'] ?? 'unknown']);
                }
            }

            // Sync Tabulations (depends on rounds, users, criteria)
            foreach ($data['tabulations'] ?? [] as $tabulation) {
                try {
                    Tabulation::updateOrCreate(
                        ['id' => $tabulation['id']],
                        $tabulation
                    );
                } catch (\Exception $e) {
                    Log::warning('Tabulation sync skipped', ['tabulation_id' => $tabulation['id'] ?? 'unknown']);
                }
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
            
            Log::info('Sync data received successfully', [
                'events_synced' => count($data['events'] ?? []),
                'contestants_synced' => count($data['contestants'] ?? []),
                'users_synced' => count($data['users'] ?? [])
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Data received and synced successfully',
                'synced_at' => now()->toISOString()
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Receive sync failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
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
