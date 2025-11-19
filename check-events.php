<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== LOCAL DATABASE CHECK ===\n\n";

echo "Events:\n";
$events = App\Models\Event::all(['id', 'event_name']);
foreach($events as $event) {
    echo "  ID: {$event->id} - {$event->event_name}\n";
}

echo "\nActives (referencing events):\n";
$actives = App\Models\Active::all(['id', 'event_id', 'round_no']);
foreach($actives as $active) {
    $eventExists = App\Models\Event::find($active->event_id);
    $status = $eventExists ? "✓" : "✗ MISSING";
    echo "  Active ID: {$active->id} - Event ID: {$active->event_id} - Round: {$active->round_no} [{$status}]\n";
}

echo "\n";
