<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usage_counters', function (Blueprint $table) {
            $table->id();
            // Nullable user_id for anonymous tracking (identified by IP).
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->string('tool_type', 50);
            $table->date('date')->index();
            $table->unsignedInteger('count')->default(0);
            $table->timestamps();

            $table->unique(['user_id', 'tool_type', 'date'], 'usage_user_tool_date');
            $table->unique(['ip_address', 'tool_type', 'date'], 'usage_ip_tool_date');
            $table->index(['ip_address', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usage_counters');
    }
};
