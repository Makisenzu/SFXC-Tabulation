<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Active extends Model
{
    protected $fillable = [
        'id',
        'event_id',
        'round_no',
        'is_active'
    ];

    public function criterias() {
        return $this->hasMany(Criteria::class);
    }
    
    public function rounds() {
        return $this->hasMany(Round::class);
    }

    public function event() {
        return $this->belongsTo(Event::class);
    }
}
