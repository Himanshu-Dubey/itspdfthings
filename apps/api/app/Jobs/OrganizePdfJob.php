<?php

namespace App\Jobs;

use App\Models\PdfJob;

class OrganizePdfJob extends ProcessPdfJob
{
    protected function process(PdfJob $pdfJob, string $scratchDir): void
    {
        $inputFile = $this->download($pdfJob->input_path, $scratchDir);
        $options   = $pdfJob->options ?? [];

        // Step 1: page selection (e.g. "1,3,5-8" or "1-z" for all)
        $pages     = $options['pages'] ?? '1-z';
        $selected  = $scratchDir.'/selected.pdf';
        $this->exec([$this->tool('qpdf'), '--empty', '--pages', $inputFile, $pages, '--', $selected]);

        // Step 2: optional rotation (e.g. "90:1,3" or "180:all")
        $outputPath = $scratchDir.'/organized.pdf';
        $rotation   = $options['rotation'] ?? null;

        if ($rotation) {
            $this->exec([$this->tool('qpdf'), $selected, "--rotate={$rotation}", '--', $outputPath]);
        } else {
            rename($selected, $outputPath);
        }

        $pdfJob->update(['output_path' => $this->upload($outputPath, $pdfJob->id, 'organized.pdf')]);
    }
}
