<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedalScore extends Model
{
    protected $fillable = [
        'id',
        'medal_tally_id',
        'event_id',
        'participant_id',
        'score',
        'medal_type'
    ];

    public function medalTally() {
        return $this->belongsTo(MedalTally::class);
    }

    public function event() {
        return $this->belongsTo(Event::class);
    }

    public function participant() {
        return $this->belongsTo(MedalTallyParticipant::class, 'participant_id');
    }
}
