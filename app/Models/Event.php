<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'id',
        'event_name',
        'event_type',
        'description',
        'event_start',
        'event_end',
        'is_active',
        'is_archived',
    ];

    public function contestants() {
        return $this->hasMany(Contestant::class);
    }
    public function criterias() {
        return $this->hasMany(Criteria::class);
    }

    public function actives() {
        return $this->hasMany(Active::class);
    }

    public function resultArchive() {
        return $this->hasMany(ResultArchive::class);
    }

    public function assigns(){
        return $this->hasMany(Assign::class);
    }

    public function medalTallies() {
        return $this->belongsToMany(MedalTally::class, 'medal_tally_events');
    }
}
