<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Event;
use Carbon\Carbon;

class UpdatePastEventsStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'events:update-past-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update past events to inactive status';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today();
        
        $updatedCount = Event::where('event_end', '<', $today)
            ->where('is_active', 1)
            ->update(['is_active' => 0]);

        $this->info("Updated {$updatedCount} past event(s) to inactive status.");
        
        return Command::SUCCESS;
    }
}
