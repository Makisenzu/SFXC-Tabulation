<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medal extends Model
{
    protected $table = 'medal';
    
    protected $fillable = [
        'event_id',
        'contestant_id',
        'medal_type',
        'rank'
    ];

    public function event() {
        return $this->belongsTo(Event::class);
    }

    public function contestant() {
        return $this->belongsTo(Contestant::class);
    }
}
