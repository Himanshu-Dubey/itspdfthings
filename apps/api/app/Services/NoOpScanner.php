<?php

namespace App\Services;

use App\Contracts\ScansFile;

/**
 * Stub scanner — always returns clean. Replace with ClamAV integration in Phase 4.
 */
class NoOpScanner implements ScansFile
{
    public function scan(string $path): bool
    {
        return true;
    }
}
