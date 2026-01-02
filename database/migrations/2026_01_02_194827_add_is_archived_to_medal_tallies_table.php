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
        Schema::table('medal_tallies', function (Blueprint $table) {
            if (!Schema::hasColumn('medal_tallies', 'is_archived')) {
                $table->boolean('is_archived')->default(false)->after('tally_title');
            }
            if (!Schema::hasColumn('medal_tallies', 'archived_at')) {
                $table->timestamp('archived_at')->nullable()->after('is_archived');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('medal_tallies', function (Blueprint $table) {
            if (Schema::hasColumn('medal_tallies', 'is_archived')) {
                $table->dropColumn('is_archived');
            }
            if (Schema::hasColumn('medal_tallies', 'archived_at')) {
                $table->dropColumn('archived_at');
            }
        });
    }
};
