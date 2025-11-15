<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MedalTallyUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $medalTallyId;

    public function __construct($medalTallyId)
    {
        $this->medalTallyId = $medalTallyId;
    }

    public function broadcastOn()
    {
        return new Channel('medal-tally-public');
    }

    public function broadcastAs()
    {
        return 'MedalTallyUpdated';
    }

    public function broadcastWith()
    {
        return [
            'medal_tally_id' => $this->medalTallyId,
            'timestamp' => now()->toISOString()
        ];
    }
}
