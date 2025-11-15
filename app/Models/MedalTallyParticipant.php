<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedalTallyParticipant extends Model
{
    protected $fillable = [
        'medal_tally_id',
        'participant_name'
    ];

    public function medalTally() {
        return $this->belongsTo(MedalTally::class);
    }

    public function scores() {
        return $this->hasMany(MedalScore::class, 'participant_id');
    }
}
