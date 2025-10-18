<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Round extends Model
{
    protected $fillable = [
        'contestant_id',
        'active_id'
    ];

    public function contestant() {
        return $this->belongsTo(Contestant::class);
    }

    public function active() {
        return $this->belongsTo(Active::class);
    }

    public function tabulations() {
        return $this->hasMany(Tabulation::class);
    }
}
