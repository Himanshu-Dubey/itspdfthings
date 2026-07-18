<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('razorpay_customer_id')->nullable()->index();
            $table->string('razorpay_subscription_id')->nullable()->index();
            $table->string('razorpay_subscription_status')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['razorpay_customer_id', 'razorpay_subscription_id', 'razorpay_subscription_status']);
        });
    }
};
