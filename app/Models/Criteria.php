<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Criteria extends Model
{
    protected $fillable = [
        'active_id',
        'criteria_desc',
        'definition',
        'percentage',
        'max_percentage',
        'is_active',
    ];

    public function active() {
        return $this->belongsTo(Active::class);
    }

    public function tabulations () {
        return $this->hasMany(Tabulation::class);
    }
}
