<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->text('value')->nullable();
            $table->string('type', 20)->default('string'); // string, boolean, integer, json
            $table->string('group', 50)->default('general');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Seed default settings
        DB::table('settings')->insert([
            ['key' => 'maintenance_mode', 'value' => '0', 'type' => 'boolean', 'group' => 'system', 'description' => 'Put the site in maintenance mode', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'announcement_banner', 'value' => null, 'type' => 'string', 'group' => 'system', 'description' => 'Global announcement banner text (null = hidden)', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'announcement_link', 'value' => null, 'type' => 'string', 'group' => 'system', 'description' => 'Optional URL for the announcement banner', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'announcement_expires_at', 'value' => null, 'type' => 'string', 'group' => 'system', 'description' => 'ISO datetime when the banner auto-hides', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'quota_anonymous_per_tool_day', 'value' => '3', 'type' => 'integer', 'group' => 'quotas', 'description' => 'Max daily tasks per tool for anonymous users', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'quota_free_user_per_tool_day', 'value' => '10', 'type' => 'integer', 'group' => 'quotas', 'description' => 'Max daily tasks per tool for free registered users', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'file_size_limit_free_bytes', 'value' => '20971520', 'type' => 'integer', 'group' => 'limits', 'description' => 'Max upload file size for free users (bytes)', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'file_size_limit_premium_bytes', 'value' => '524288000', 'type' => 'integer', 'group' => 'limits', 'description' => 'Max upload file size for premium users (bytes)', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'tools_enabled', 'value' => '{"merge":true,"split":true,"compress":true,"organize":true,"image-to-pdf":true,"pdf-to-image":true,"watermark":true,"page-numbers":true,"protect":true,"unlock":true}', 'type' => 'json', 'group' => 'tools', 'description' => 'Per-tool enabled/disabled toggle', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'premium_price_usd', 'value' => '9.99', 'type' => 'string', 'group' => 'billing', 'description' => 'Monthly premium subscription price in USD', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
