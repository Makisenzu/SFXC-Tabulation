<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Active extends Model
{
    protected $fillable = [
        'round_no'
    ];

    public function criterias(){
        return $this->hasMany(Criteria::class);
    }
}
