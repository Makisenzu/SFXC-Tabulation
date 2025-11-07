<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class JudgeHelpRequested implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $judgeName;
    public $judgeId;
    public $eventName;
    public $roundNumber;
    public $timestamp;

    public function __construct($judgeName, $judgeId, $eventName, $roundNumber)
    {
        $this->judgeName = $judgeName;
        $this->judgeId = $judgeId;
        $this->eventName = $eventName;
        $this->roundNumber = $roundNumber;
        $this->timestamp = now()->format('h:i A');
    }

    public function broadcastOn()
    {
        return new Channel('admin-notifications');
    }

    public function broadcastAs()
    {
        return 'judge.help.requested';
    }
    
    public function broadcastWith()
    {
        return [
            'judgeName' => $this->judgeName,
            'judgeId' => $this->judgeId,
            'eventName' => $this->eventName,
            'roundNumber' => $this->roundNumber,
            'timestamp' => $this->timestamp
        ];
    }
}
