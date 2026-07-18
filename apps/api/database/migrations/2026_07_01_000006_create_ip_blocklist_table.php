<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ip_blocklist', function (Blueprint $table) {
            $table->id();
            $table->string('ip_address', 50)->index(); // supports IPv4, IPv6, and CIDR ranges
            $table->text('reason');
            $table->foreignId('blocked_by')->nullable()->constrained('admin_users')->nullOnDelete();
            $table->timestamp('expires_at')->nullable(); // null = permanent block
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ip_blocklist');
    }
};
