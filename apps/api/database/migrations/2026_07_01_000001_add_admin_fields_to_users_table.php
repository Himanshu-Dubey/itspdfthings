<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_banned')->default(false)->after('plan');
            $table->text('banned_reason')->nullable()->after('is_banned');
            $table->string('country', 2)->nullable()->after('banned_reason');
            $table->timestamp('last_active_at')->nullable()->after('country');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_banned', 'banned_reason', 'country', 'last_active_at']);
        });
    }
};
