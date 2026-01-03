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
        Schema::table('rounds', function (Blueprint $table) {
            $table->index('active_id');
            $table->index(['active_id', 'contestant_id']);
        });

        Schema::table('tabulations', function (Blueprint $table) {
            $table->index('round_id');
            $table->index('user_id');
            $table->index(['round_id', 'user_id']);
            $table->index(['user_id', 'criteria_id']);
        });

        Schema::table('criterias', function (Blueprint $table) {
            $table->index('active_id');
            $table->index(['active_id', 'is_active']);
        });

        Schema::table('actives', function (Blueprint $table) {
            $table->index('event_id');
            $table->index(['event_id', 'is_active']);
        });

        Schema::table('assigns', function (Blueprint $table) {
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rounds', function (Blueprint $table) {
            $table->dropIndex(['active_id']);
            $table->dropIndex(['active_id', 'contestant_id']);
        });

        Schema::table('tabulations', function (Blueprint $table) {
            $table->dropIndex(['round_id']);
            $table->dropIndex(['user_id']);
            $table->dropIndex(['round_id', 'user_id']);
            $table->dropIndex(['user_id', 'criteria_id']);
        });

        Schema::table('criterias', function (Blueprint $table) {
            $table->dropIndex(['active_id']);
            $table->dropIndex(['active_id', 'is_active']);
        });

        Schema::table('actives', function (Blueprint $table) {
            $table->dropIndex(['event_id']);
            $table->dropIndex(['event_id', 'is_active']);
        });

        Schema::table('assigns', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
        });
    }
};
