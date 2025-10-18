<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Round extends Model
{
    protected $fillable = [
        'contestant_id',
        'round_id'
    ];

    public function contenstant() {
        return $this->belongsTo(Contestant::class);
    }

    public function active() {
        return $this->belongsTo(Active::class);
    }
}
