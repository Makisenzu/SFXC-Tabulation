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

            Log::info('Starting sync to online server', [
                'url' => $onlineUrl,
                'event_count' => count($syncData['events']),
                'event_ids' => collect($syncData['events'])->pluck('id')->toArray(),
                'active_count' => count($syncData['actives']),
                'active_event_ids' => collect($syncData['actives'])->pluck('event_id')->unique()->toArray()
            ]);

            // Send data to online server
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Accept' => 'application/json',
            ])->timeout(120)->post($onlineUrl . '/api/sync/receive', [
                'data' => $syncData
            ]);

            if ($response->successful()) {
                DB::commit();
                
                // Cache last sync time
                cache(['last_sync_time' => now()], now()->addDays(30));
                
                Log::info('Sync completed successfully', [
                    'events' => count($syncData['events']),
                    'contestants' => count($syncData['contestants'])
                ]);
                
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
                Log::error('Sync failed - Server error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new \Exception('Online server returned error: ' . $response->body());
            }

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Sync failed - Exception', [
                'error' => $e->getMessage(),
                'url' => $onlineUrl ?? 'N/A'
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Sync failed: ' . $e->getMessage()
            ], 500);
        }
    }

    private function prepareAllData()
    {
        // Data organized in correct foreign key dependency order
        // Following DATABASE_IMPORT_SEQUENCE.md
        return [
            // LEVEL 1: Base tables (no dependencies)
            'roles' => \App\Models\Role::all()->toArray(),
            'events' => Event::all()->toArray(),
            
            // LEVEL 2: Tables depending on Level 1
            'users' => User::where('role_id', 2)->get()->toArray(), // Only judges
            'contestants' => Contestant::all()->toArray(),
            'actives' => Active::all()->toArray(),
            'assigns' => Assign::all()->toArray(),
            'medal_tallies' => MedalTally::all()->toArray(),
            
            // LEVEL 3: Tables depending on Level 2
            'criteria' => Criteria::all()->toArray(),
            'rounds' => Round::all()->toArray(),
            'medal_participants' => MedalTallyParticipant::all()->toArray(),
            
            // LEVEL 4: Tables depending on Level 3 (CRITICAL - Contains Scores!)
            'tabulations' => Tabulation::all()->toArray(),
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
            
            Log::info('Starting sync with proper table sequence', [
                'events' => count($data['events'] ?? []),
                'users' => count($data['users'] ?? []),
                'tabulations' => count($data['tabulations'] ?? [])
            ]);

            $stats = [];

            // ========================================
            // LEVEL 1: Base Tables (No Dependencies)
            // ========================================
            
            // Sync Roles (if provided)
            $stats['roles'] = $this->syncTable($data['roles'] ?? [], \App\Models\Role::class, 'roles');
            
            // Sync Events
            $stats['events'] = $this->syncTable($data['events'] ?? [], Event::class, 'events');

            // ========================================
            // LEVEL 2: Tables Depending on Level 1
            // ========================================
            
            // Sync Users (judges only)
            $stats['users'] = $this->syncUsers($data['users'] ?? []);
            
            // Sync Contestants (depends on events)
            $stats['contestants'] = $this->syncTable($data['contestants'] ?? [], Contestant::class, 'contestants');
            
            // Sync Actives (depends on events)
            $stats['actives'] = $this->syncTable($data['actives'] ?? [], Active::class, 'actives');
            
            // Sync Assigns (depends on events, users)
            $stats['assigns'] = $this->syncTable($data['assigns'] ?? [], Assign::class, 'assigns');
            
            // Sync Medal Tallies
            $stats['medal_tallies'] = $this->syncTable($data['medal_tallies'] ?? [], MedalTally::class, 'medal_tallies');

            // ========================================
            // LEVEL 3: Tables Depending on Level 2
            // ========================================
            
            // Sync Criterias (depends on events, actives)
            $stats['criteria'] = $this->syncTable($data['criteria'] ?? [], Criteria::class, 'criteria');
            
            // Sync Rounds (depends on contestants, actives)
            $stats['rounds'] = $this->syncTable($data['rounds'] ?? [], Round::class, 'rounds');
            
            // Sync Medal Participants (depends on medal_tallies)
            $stats['medal_participants'] = $this->syncTable($data['medal_participants'] ?? [], MedalTallyParticipant::class, 'medal_participants');

            // ========================================
            // LEVEL 4: Critical Tables (SCORES!)
            // ========================================
            
            // Sync Tabulations - CONTAINS ALL SCORES (depends on rounds, users, criterias)
            $stats['tabulations'] = $this->syncTable($data['tabulations'] ?? [], Tabulation::class, 'tabulations');
            
            // Sync Medal Scores (depends on medal_tallies, events, medal_participants)
            $stats['medal_scores'] = $this->syncTable($data['medal_scores'] ?? [], MedalScore::class, 'medal_scores');

            DB::commit();
            
            Log::info('Sync completed successfully with correct sequence', $stats);

            return response()->json([
                'success' => true,
                'message' => 'Data synced successfully in correct foreign key order',
                'synced_at' => now()->toISOString(),
                'summary' => $stats
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Sync failed - Rolling back all changes', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Sync failed: ' . $e->getMessage()
            ], 500);
        }
    }

    private function syncTable(array $records, string $modelClass, string $tableName): int
    {
        $synced = 0;
        foreach ($records as $record) {
            try {
                $modelClass::updateOrCreate(
                    ['id' => $record['id']],
                    $record
                );
                $synced++;
            } catch (\Exception $e) {
                Log::error("Failed to sync {$tableName} record", [
                    'table' => $tableName,
                    'record_id' => $record['id'] ?? 'unknown',
                    'error' => $e->getMessage()
                ]);
                throw new \Exception("Foreign key constraint failed for {$tableName}: " . $e->getMessage());
            }
        }
        Log::info("{$tableName} synced", ['count' => $synced]);
        return $synced;
    }

    private function syncUsers(array $users): int
    {
        $synced = 0;
        foreach ($users as $user) {
            $existingUser = User::where('username', $user['username'])->first();
            
            if (!$existingUser) {
                try {
                    User::create($user);
                    $synced++;
                } catch (\Exception $e) {
                    Log::warning('User creation skipped', [
                        'username' => $user['username'],
                        'error' => $e->getMessage()
                    ]);
                }
            }
        }
        Log::info('Users synced', ['count' => $synced]);
        return $synced;
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
