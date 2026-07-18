<?php

namespace App\Contracts;

interface ScansFile
{
    /**
     * Scan a local file for viruses/malware.
     *
     * @param  string  $path  Absolute path to the file on disk.
     * @return bool  True if the file is clean, false if a threat is detected.
     *
     * @throws \App\Exceptions\ScanFailedException  When the scanner itself errors out.
     */
    public function scan(string $path): bool;
}
