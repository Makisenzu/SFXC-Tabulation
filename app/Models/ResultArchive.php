<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResultArchive extends Model
{
    protected $table = 'results_archive';
    
    protected $fillable = [
        'event_id',
        'final_results',
        'contestant_rankings',
        'notes',
        'archived_at',
    ];

    public function event() {
        return $this->belongsTo(Event::class);
    }
}
