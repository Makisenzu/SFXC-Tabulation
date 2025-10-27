<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Criteria extends Model
{
    protected $fillable = [
        'event_id',
        'active_id', 
        'criteria_desc',
        'definition',
        'percentage',
        'valid_round',
        'max_percentage',
        'is_active',
    ];

    public function event() {
        return $this->belongsTo(Event::class);
    }

    public function active() {
        return $this->belongsTo(Active::class);
    }

    public function tabulations () {
        return $this->hasMany(Tabulation::class);
    }
}
