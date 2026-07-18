<?php

namespace App\Jobs;

use App\Models\PdfJob;

class ImageToPdfJob extends ProcessPdfJob
{
    protected function process(PdfJob $pdfJob, string $scratchDir): void
    {
        // input_path may be a JSON array (multi-image) or a single path string.
        $decoded    = json_decode($pdfJob->input_path, true);
        $inputPaths = is_array($decoded) ? $decoded : [$pdfJob->input_path];

        $localFiles = [];
        foreach ($inputPaths as $i => $storagePath) {
            $ext          = pathinfo($storagePath, PATHINFO_EXTENSION);
            $localFiles[] = $this->download($storagePath, $scratchDir, "img_{$i}.{$ext}");
        }

        $outputPath = $scratchDir.'/output.pdf';

        // magick img_0.jpg img_1.jpg output.pdf
        $this->exec(array_merge([$this->tool('imagemagick')], $localFiles, [$outputPath]));

        $pdfJob->update(['output_path' => $this->upload($outputPath, $pdfJob->id, 'output.pdf')]);
    }
}
