<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'event_name',
        'event_type',
        'description',
        'event_date',
        'is_active',
        'is_archived',
    ];

    public function contestants() {
        return $this->hasMany(Contestant::class);
    }

    public function actives() {
        return $this->hasMany(Active::class);
    }

    public function resultArchive() {
        return $this->hasMany(ResultArchive::class);
    }
}
