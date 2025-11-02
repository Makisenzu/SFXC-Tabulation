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

Broadcast::channel('tabulation.{eventId}.{roundNo}', function ($user, $eventId, $roundNo) {
    return Assign::where('user_id', $user->id)
        ->where('event_id', $eventId)
        ->exists();
});
