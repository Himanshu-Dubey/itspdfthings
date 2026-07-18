<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AbuseLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'ip_address',
        'reason',
        'endpoint',
        'action_taken',
        'user_id',
        'metadata',
        'triggered_at',
    ];

    protected function casts(): array
    {
        return [
            'metadata'     => 'array',
            'triggered_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function log(
        string $ip,
        string $reason,
        ?string $endpoint = null,
        string $actionTaken = 'logged',
        ?int $userId = null,
        array $metadata = [],
    ): void {
        static::create([
            'ip_address'    => $ip,
            'reason'        => $reason,
            'endpoint'      => $endpoint,
            'action_taken'  => $actionTaken,
            'user_id'       => $userId,
            'metadata'      => $metadata ?: null,
            'triggered_at'  => now(),
        ]);
    }
}
