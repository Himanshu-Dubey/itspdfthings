<?php

namespace App\Jobs;

use App\Models\PdfJob;
use ZipArchive;

class PdfToImageJob extends ProcessPdfJob
{
    protected function process(PdfJob $pdfJob, string $scratchDir): void
    {
        $inputFile = $this->download($pdfJob->input_path, $scratchDir);

        // Repair structural issues before qpdf
        try {
            $inputFile = $this->repairPdf($inputFile, $scratchDir);
        } catch (\Throwable) {
            // If repair fails, try processing the original anyway
        }

        $options   = $pdfJob->options ?? [];
        $format    = in_array($options['format'] ?? '', ['png', 'jpg']) ? $options['format'] : 'jpg';
        $dpi       = max(72, min(600, (int) ($options['dpi'] ?? 150)));

        // Count pages first using qpdf (already installed)
        $countProc = new \Symfony\Component\Process\Process([
            $this->tool('qpdf'), '--show-npages', $inputFile,
        ]);
        $countProc->run();
        $pageCount = max(1, (int) trim($countProc->getOutput()));

        // Process one page at a time to avoid OOM on large PDFs
        for ($i = 0; $i < $pageCount; $i++) {
            $this->exec([
                $this->tool('imagemagick'),
                '-limit', 'memory', '256MiB',
                '-limit', 'map', '512MiB',
                '-density', (string) $dpi,
                $inputFile.'['.$i.']',
                $scratchDir.'/page-'.($i + 1).'.'.$format,
            ], 120);
        }

        $zipPath = $scratchDir.'/images.zip';
        $zip     = new ZipArchive();
        $zip->open($zipPath, ZipArchive::CREATE);

        foreach (glob($scratchDir."/page-*.{$format}") ?: [] as $img) {
            $zip->addFile($img, basename($img));
        }
        $zip->close();

        $pdfJob->update(['output_path' => $this->upload($zipPath, $pdfJob->id, 'images.zip')]);
    }
}
