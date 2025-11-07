<?php

namespace App\Events;

use App\Models\Tabulation;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class JudgeScores implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $scoreData;
    public $eventId;
    public $roundNo;

    /**
     * Create a new event instance.
     */
    public function __construct(Tabulation $tabulation)
    {
        // Load relationships
        $tabulation->load(['round.contestant', 'round.active', 'criteria', 'user']);
        
        $this->eventId = $tabulation->round->active->event_id;
        $this->roundNo = $tabulation->round->active->round_no;
        
        // Prepare score data for broadcast
        $this->scoreData = [
            'tabulation_id' => $tabulation->id,
            'judge_id' => $tabulation->user_id,
            'judge_name' => $tabulation->user->username,
            'contestant_id' => $tabulation->round->contestant_id,
            'contestant_name' => $tabulation->round->contestant->contestant_name,
            'criteria_id' => $tabulation->criteria_id,
            'criteria_desc' => $tabulation->criteria->criteria_desc,
            'score' => $tabulation->score,
            'is_lock' => $tabulation->is_lock,
            'event_id' => $this->eventId,
            'round_no' => $this->roundNo,
            'updated_at' => $tabulation->updated_at->toDateTimeString(),
        ];
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("score-updates.{$this->eventId}.{$this->roundNo}"),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'score.updated';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'score' => $this->scoreData,
        ];
    }
}
