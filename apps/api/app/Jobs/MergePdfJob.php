<?php

namespace App\Jobs;

use App\Models\PdfJob;
use Illuminate\Support\Facades\Storage;

class MergePdfJob extends ProcessPdfJob
{
    protected function process(PdfJob $pdfJob, string $scratchDir): void
    {
        $inputPaths = json_decode($pdfJob->input_path, true);

        $localFiles = [];
        foreach ($inputPaths as $i => $storagePath) {
            $localFiles[] = $this->download($storagePath, $scratchDir, "input_{$i}_".basename($storagePath));
        }

        $outputPath = $scratchDir.'/merged.pdf';

        // qpdf --empty --pages file1.pdf 1-z file2.pdf 1-z -- output.pdf
        $args = [$this->tool('qpdf'), '--empty', '--pages'];
        foreach ($localFiles as $file) {
            $args[] = $file;
            $args[] = '1-z';
        }
        $args[] = '--';
        $args[] = $outputPath;

        $this->exec($args);

        $pdfJob->update(['output_path' => $this->upload($outputPath, $pdfJob->id, 'merged.pdf')]);
    }
}
