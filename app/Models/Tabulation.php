<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tabulation extends Model
{
    protected $fillable = [
        'round_id',
        'user_id',
        'criteria_id',
        'score',
        'is_lock'
    ];

    public function round () {
        return $this->belongsTo(Round::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function criteria() {
        return $this->belongsTo(Criteria::class);
    }
}
