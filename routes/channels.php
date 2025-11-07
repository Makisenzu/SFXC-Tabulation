<?php

use App\Models\Assign;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('public-driver-locations', function ($user) {
    return true;
});

Broadcast::channel('driver.{driverId}', function ($user, $driverId) {
    return (int) $user->driver->id === (int) $driverId;
});

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('score-updates.{eventId}.{roundNo}', function ($user, $eventId, $roundNo) {
    // Allow judges assigned to the event
    $isAssignedJudge = Assign::where('user_id', $user->id)
        ->where('event_id', $eventId)
        ->exists();
    
    // Allow admin users (role_id = 1)
    $isAdmin = $user->role_id === 1;
    
    return $isAssignedJudge || $isAdmin;
});

Broadcast::channel('admin-notifications', function ($user) {
    // Only admins can listen to this channel
    return $user->role_id === 1;
});
