<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contestant extends Model
{
    protected $fillable = [
        'id',
        'event_id',
        'contestant_name',
        'photo',
        'sequence_no',
        'is_active'
    ];

    public function rounds() {
        return $this->hasMany(Round::class);
    }

    public function event() {
        return $this->belongsTo(Event::class);
    }
}
