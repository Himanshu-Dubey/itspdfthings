<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_audit_log', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_user_id')->constrained('admin_users')->cascadeOnDelete();
            $table->string('action', 100); // user.ban, user.plan_change, setting.update, ip.block, job.retry, etc.
            $table->string('subject_type', 100)->nullable(); // App\Models\User, App\Models\PdfJob, etc.
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->json('before')->nullable(); // state before the action
            $table->json('after')->nullable();  // state after the action
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['subject_type', 'subject_id']);
            $table->index('admin_user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_audit_log');
    }
};
