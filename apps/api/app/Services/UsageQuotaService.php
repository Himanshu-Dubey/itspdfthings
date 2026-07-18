<?php

namespace App\Services;

use App\Models\Setting;
use App\Models\UsageCounter;
use Illuminate\Http\Request;

class UsageQuotaService
{
    /**
     * Check whether the requester may run one more job for this tool today,
     * and if so, record the usage. Returns an error message if the quota is
     * exhausted, or null if the request may proceed.
     */
    public function checkAndIncrement(Request $request, string $toolType): ?string
    {
        $user = $request->user();

        if ($user?->isPremium()) {
            return null;
        }

        $limit = $user
            ? (int) Setting::get('quota_free_user_per_tool_day', 10)
            : (int) Setting::get('quota_anonymous_per_tool_day', 3);

        $today = now()->toDateString();

        $counter = $user
            ? UsageCounter::firstOrCreate(
                ['user_id' => $user->id, 'tool_type' => $toolType, 'date' => $today],
                ['count' => 0],
            )
            : UsageCounter::firstOrCreate(
                ['ip_address' => $request->ip(), 'tool_type' => $toolType, 'date' => $today],
                ['count' => 0],
            );

        if ($counter->count >= $limit) {
            return $user
                ? "Daily limit reached for this tool ({$limit}/day). Upgrade to Premium for unlimited use."
                : "Daily limit reached for this tool ({$limit}/day). Sign up for a free account for a higher limit.";
        }

        $counter->increment('count');

        return null;
    }
}
