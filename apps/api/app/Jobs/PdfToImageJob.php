<?php

namespace App\Jobs;

use App\Models\PdfJob;
use ZipArchive;

class PdfToImageJob extends ProcessPdfJob
{
    protected function process(PdfJob $pdfJob, string $scratchDir): void
    {
        $inputFile = $this->download($pdfJob->input_path, $scratchDir);
        $options   = $pdfJob->options ?? [];
        $format    = in_array($options['format'] ?? '', ['png', 'jpg']) ? $options['format'] : 'jpg';
        $dpi       = max(72, min(600, (int) ($options['dpi'] ?? 150)));

        // magick -density 150 input.pdf page.jpg  →  page-0.jpg, page-1.jpg, ...
        $this->exec([
            $this->tool('imagemagick'),
            '-density', (string) $dpi,
            $inputFile,
            $scratchDir."/page.{$format}",
        ]);

        $zipPath = $scratchDir.'/images.zip';
        $zip     = new ZipArchive();
        $zip->open($zipPath, ZipArchive::CREATE);

        foreach (glob($scratchDir."/page*.{$format}") ?: [] as $img) {
            $zip->addFile($img, basename($img));
        }
        $zip->close();

        $pdfJob->update(['output_path' => $this->upload($zipPath, $pdfJob->id, 'images.zip')]);
    }
}
