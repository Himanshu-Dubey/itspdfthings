<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IpBlocklist extends Model
{
    protected $table = 'ip_blocklist';

    protected $fillable = [
        'ip_address',
        'reason',
        'blocked_by',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
        ];
    }

    public function blockedBy(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class, 'blocked_by');
    }

    /** Whether a given IP is currently blocked — supports exact IPs and CIDR ranges. */
    public static function isBlocked(string $ip): bool
    {
        return static::query()
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->get(['ip_address'])
            ->contains(fn ($entry) => static::ipMatches($ip, $entry->ip_address));
    }

    private static function ipMatches(string $ip, string $entry): bool
    {
        if (! str_contains($entry, '/')) {
            return $ip === $entry;
        }

        [$subnet, $bits] = explode('/', $entry, 2);
        $ipLong     = ip2long($ip);
        $subnetLong = ip2long($subnet);

        if ($ipLong === false || $subnetLong === false) {
            return false;
        }

        $mask = -1 << (32 - (int) $bits);

        return ($ipLong & $mask) === ($subnetLong & $mask);
    }
}
