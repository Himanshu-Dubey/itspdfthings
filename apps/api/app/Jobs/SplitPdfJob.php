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

        $range = $options['pages'] ?? null;

        if ($range) {
            // "1-2,3-4" → each comma group becomes its own PDF file.
            $groups = array_map('trim', explode(',', $range));
            $files  = [];

            foreach ($groups as $i => $group) {
                $out = $scratchDir.'/pages_'.str_replace('-', '_', $group).'.pdf';
                $this->exec([$this->tool('qpdf'), '--empty', '--pages', $inputFile, $group, '--', $out]);
                $files[] = $out;
            }

            if (count($files) === 1) {
                // Single range → return as PDF directly.
                $pdfJob->update(['output_path' => $this->upload($files[0], $pdfJob->id, 'split.pdf')]);
                return;
            }

            // Multiple ranges → zip them.
            $zipPath = $scratchDir.'/split.zip';
            $zip     = new ZipArchive();
            $zip->open($zipPath, ZipArchive::CREATE);

            foreach ($files as $f) {
                $zip->addFile($f, basename($f));
            }
            $zip->close();

            $pdfJob->update(['output_path' => $this->upload($zipPath, $pdfJob->id, 'split.zip')]);
        } else {
            // No range specified → split every page into its own file.
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
}
