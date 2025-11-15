<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('medal_tallies', function (Blueprint $table) {
            $table->id();
            $table->string('tally_title');
            $table->timestamps();
        });

        Schema::create('medal_tally_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medal_tally_id')->constrained('medal_tallies')->cascadeOnDelete();
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('medal_tally_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medal_tally_id')->constrained('medal_tallies')->cascadeOnDelete();
            $table->string('participant_name');
            $table->timestamps();
        });

        Schema::create('medal_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medal_tally_id')->constrained('medal_tallies')->cascadeOnDelete();
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->foreignId('participant_id')->constrained('medal_tally_participants')->cascadeOnDelete();
            $table->integer('score');
            $table->string('medal_type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medal_scores');
        Schema::dropIfExists('medal_tally_participants');
        Schema::dropIfExists('medal_tally_events');
        Schema::dropIfExists('medal_tallies');
    }
};
