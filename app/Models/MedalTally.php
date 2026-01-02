<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedalTally extends Model
{
    protected $fillable = [
        'id',
        'tally_title',
        'is_archived',
        'archived_at'
    ];

    protected $casts = [
        'is_archived' => 'boolean',
        'archived_at' => 'datetime'
    ];

    public function events() {
        return $this->belongsToMany(Event::class, 'medal_tally_events');
    }

    public function participants() {
        return $this->hasMany(MedalTallyParticipant::class);
    }

    public function scores() {
        return $this->hasMany(MedalScore::class);
    }
}
