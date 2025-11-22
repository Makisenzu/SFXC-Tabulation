<?php

namespace App\Events;

use App\Models\Criteria;
use App\Models\Contestant;
use App\Models\Tabulation;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class TabulationBroadcast implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $tabulationData;
    public $eventId;
    public $roundNo;

    public function __construct(Tabulation $tabulation)
    {
        $this->tabulationData = $this->prepareBroadcastData($tabulation);
        $this->eventId = $tabulation->round->active->event_id;
        $this->roundNo = $tabulation->round->active->round_no;
    }

    public function broadcastOn()
    {
        return new PrivateChannel("tabulation.{$this->eventId}.{$this->roundNo}");
    }

    public function broadcastAs()
    {
        return 'tabulation.updated';
    }

    public function broadcastWith()
    {
        return [
            'tabulationData' => $this->tabulationData
        ];
    }

    private function prepareBroadcastData(Tabulation $tabulation)
    {
        $tabulation->load([
            'round.contestant',
            'round.active.event',
            'criteria',
            'user'
        ]);

        $activeRound = $tabulation->round->active;
        $event = $activeRound->event;

        $contestants = Contestant::whereHas('rounds', function($query) use ($activeRound) {
            $query->where('active_id', $activeRound->id);
        })
        ->with(['rounds' => function($query) use ($activeRound) {
            $query->where('active_id', $activeRound->id);
        }])
        ->orderBy('sequence_no')
        ->get();

        $criteria = Criteria::where('active_id', $activeRound->id)
            ->where('is_active', 1)
            ->orderBy('id')
            ->get();

        $allScores = Tabulation::whereHas('round', function($query) use ($activeRound) {
            $query->where('active_id', $activeRound->id);
        })
        ->with(['criteria', 'round.contestant'])
        ->get()
        ->groupBy('round.contestant_id');

        $contestantsData = $contestants->map(function($contestant) use ($allScores, $criteria) {
            $contestantScores = $allScores->get($contestant->id, collect());
            
            $criteriaWithScores = $criteria->map(function($criterion) use ($contestantScores) {
                $scoreRecord = $contestantScores->firstWhere('criteria_id', $criterion->id);
                
                return [
                    'id' => $criterion->id,
                    'criteria_desc' => $criterion->criteria_desc,
                    'definition' => $criterion->definition,
                    'percentage' => $criterion->percentage,
                    'max_percentage' => $criterion->max_percentage,
                    'score' => $scoreRecord ? $scoreRecord->score : 0,
                ];
            });

            $totalScore = $criteriaWithScores->sum('score');

            return [
                'id' => $contestant->id,
                'contestant_name' => $contestant->contestant_name,
                'photo' => $contestant->photo,
                'sequence_no' => $contestant->sequence_no,
                'round_id' => $contestant->rounds->first()->id,
                'criteria' => $criteriaWithScores,
                'total_score' => $totalScore
            ];
        });

        return [
            'event' => [
                'id' => $event->id,
                'event_name' => $event->event_name,
                'event_type' => $event->event_type,
            ],
            'active_round' => [
                'id' => $activeRound->id,
                'round_no' => $activeRound->round_no,
                'is_active' => $activeRound->is_active,
            ],
            'contestants' => $contestantsData,
            'summary' => [
                'total_contestants' => $contestants->count(),
                'total_criteria' => $criteria->count(),
            ],
            'new_record' => [
                'id' => $tabulation->id,
                'contestant_name' => $tabulation->round->contestant->contestant_name,
                'criteria_desc' => $tabulation->criteria->criteria_desc,
                'judge_name' => $tabulation->user->name,
            ]
        ];
    }
}