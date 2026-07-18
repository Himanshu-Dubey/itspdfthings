<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('abuse_logs', function (Blueprint $table) {
            $table->id();
            $table->string('ip_address', 45)->index();
            $table->string('reason', 100); // rate_limit_breach, invalid_file_type, scan_failure, etc.
            $table->string('endpoint', 255)->nullable();
            $table->string('action_taken', 100)->nullable(); // blocked, warned, logged
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->json('metadata')->nullable(); // extra context (user agent, referer, etc.)
            $table->timestamp('triggered_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('abuse_logs');
    }
};
