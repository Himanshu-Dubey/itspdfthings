<?php

namespace App\Jobs;

use App\Models\PdfJob;
use Illuminate\Support\Facades\Storage;

/**
 * Phase 0 no-op job — copies input to output unchanged.
 * Proves the full upload → queue → worker → storage → download pipeline.
 */
class EchoJob extends ProcessPdfJob
{
    protected function process(PdfJob $pdfJob, string $scratchDir): void
    {
        // Download input from object storage to scratch.
        $localInput = $scratchDir.'/input.bin';
        file_put_contents($localInput, Storage::disk()->get($pdfJob->input_path));

        // No-op transformation: copy input as output.
        $outputKey = 'outputs/'.$pdfJob->id.'/echo-output.bin';
        Storage::disk()->put($outputKey, file_get_contents($localInput));

        $pdfJob->update(['output_path' => $outputKey]);
    }
}
