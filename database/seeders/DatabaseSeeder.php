<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use App\Models\Event;
use App\Models\Contestant;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Roles
        $adminRole = Role::create(['role_name' => 'Admin']);
        $judgeRole = Role::create(['role_name' => 'Judge']);
        $facilitatorRole = Role::create(['role_name' => 'Facilitator']);

        // Create Admin User
        User::create([
            'role_id' => $adminRole->id,
            'username' => 'admin',
            'password' => Hash::make('12345678'),
            'is_active' => 1
        ]);

        // Create Judge Users
        User::create([
            'role_id' => $judgeRole->id,
            'username' => 'judge1',
            'password' => Hash::make('password'),
            'is_active' => 1
        ]);

        User::create([
            'role_id' => $judgeRole->id,
            'username' => 'judge2',
            'password' => Hash::make('password'),
            'is_active' => 1
        ]);

        // Create Facilitator User
        User::create([
            'role_id' => $facilitatorRole->id,
            'username' => 'facilitator',
            'password' => Hash::make('password'),
            'is_active' => 1
        ]);

        // Create 3 Events
        $events = [
            [
                'event_name' => 'Vocal Solo',
                'event_type' => 'Solo',
                'description' => 'Individual vocal performance competition',
                'event_start' => now(),
                'event_end' => now()->addDays(1),
                'is_active' => 1,
                'is_archived' => 0
            ],
            [
                'event_name' => 'Dance Competition',
                'event_type' => 'Group',
                'description' => 'Group dance performance competition',
                'event_start' => now()->addDays(2),
                'event_end' => now()->addDays(3),
                'is_active' => 1,
                'is_archived' => 0
            ],
            [
                'event_name' => 'Instrumental Performance',
                'event_type' => 'Solo',
                'description' => 'Individual instrumental performance competition',
                'event_start' => now()->addDays(4),
                'event_end' => now()->addDays(5),
                'is_active' => 1,
                'is_archived' => 0
            ]
        ];

        // Participant names for each event
        $participantSets = [
            // Vocal Solo participants
            [
                'Maria Santos',
                'Juan dela Cruz',
                'Sofia Reyes',
                'Miguel Torres',
                'Isabella Garcia'
            ],
            // Dance Competition participants
            [
                'Team Alpha',
                'Team Beta',
                'Team Gamma',
                'Team Delta',
                'Team Omega'
            ],
            // Instrumental Performance participants
            [
                'Carlos Mendoza',
                'Ana Rodriguez',
                'Luis Fernandez',
                'Carmen Morales',
                'Diego Ramirez'
            ]
        ];

        // Create events and contestants
        foreach ($events as $index => $eventData) {
            $event = Event::create($eventData);

            // Create 5 contestants for each event
            foreach ($participantSets[$index] as $seq => $participantName) {
                Contestant::create([
                    'event_id' => $event->id,
                    'contestant_name' => $participantName,
                    'photo' => null,
                    'sequence_no' => $seq + 1,
                    'is_active' => 1
                ]);
            }
        }

        $this->command->info('✅ Database seeded successfully!');
        $this->command->info('📊 Created: 3 Roles, 4 Users, 3 Events, 15 Contestants');
        $this->command->info('🔐 Admin credentials: username: admin, password: 12345678');
        $this->command->info('🔐 Judge credentials: username: judge1/judge2, password: password');
        $this->command->info('🔐 Facilitator credentials: username: facilitator, password: password');
    }
}
