<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contestant extends Model
{
    protected $fillable = [
        'contestant_name',
        'photo',
        'sequence_no',
        'is_active'
    ];
}
