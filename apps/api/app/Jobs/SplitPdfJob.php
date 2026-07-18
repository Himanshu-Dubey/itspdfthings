<?php

namespace App\Jobs;

use App\Models\PdfJob;
use ZipArchive;

class SplitPdfJob extends ProcessPdfJob
{
    protected function process(PdfJob $pdfJob, string $scratchDir): void
    {
        $inputFile = $this->download($pdfJob->input_path, $scratchDir);
        $options   = $pdfJob->options ?? [];

        // Optional page range: "1-3,5" keeps only those pages before splitting.
        // Without it, every page becomes its own file.
        $range = $options['pages'] ?? null;

        if ($range) {
            // Extract subset first, then split that.
            $subset = $scratchDir.'/subset.pdf';
            $this->exec([$this->tool('qpdf'), '--empty', '--pages', $inputFile, $range, '--', $subset]);
            $inputFile = $subset;
        }

        // qpdf splits to scratchDir/page-001.pdf, page-002.pdf, ...
        $this->exec([$this->tool('qpdf'), $inputFile, '--split-pages', $scratchDir.'/page-%d.pdf']);

        $zipPath = $scratchDir.'/split.zip';
        $zip     = new ZipArchive();
        $zip->open($zipPath, ZipArchive::CREATE);

        foreach (glob($scratchDir.'/page-*.pdf') ?: [] as $page) {
            $zip->addFile($page, basename($page));
        }
        $zip->close();

        $pdfJob->update(['output_path' => $this->upload($zipPath, $pdfJob->id, 'split.zip')]);
    }
}
