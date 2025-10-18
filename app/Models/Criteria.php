<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Criteria extends Model
{
    protected $fillable = [
        'round_no',
        'criteria_desc',
        'definition',
        'percentage',
        'max_percentage',
        'is_active',
    ];

    public function roundNumber() {
        return $this->belongsTo(Active::class);
    }
}
