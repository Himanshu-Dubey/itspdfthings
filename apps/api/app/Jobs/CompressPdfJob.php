<?php

namespace App\Jobs;

use App\Models\PdfJob;

class CompressPdfJob extends ProcessPdfJob
{
    // Maps UI-facing quality labels → Ghostscript PDFSETTINGS values.
    private const QUALITY_MAP = [
        'low'    => '/screen',   // 72 dpi, lowest file size
        'medium' => '/ebook',    // 150 dpi, good balance (default)
        'high'   => '/printer',  // 300 dpi, near-print quality
    ];

    protected function process(PdfJob $pdfJob, string $scratchDir): void
    {
        $inputFile  = $this->download($pdfJob->input_path, $scratchDir);
        $options    = $pdfJob->options ?? [];
        $quality    = self::QUALITY_MAP[$options['quality'] ?? 'medium'] ?? '/ebook';
        $outputPath = $scratchDir.'/compressed.pdf';

        $this->exec([
            $this->tool('ghostscript'),
            '-sDEVICE=pdfwrite',
            '-dCompatibilityLevel=1.4',
            "-dPDFSETTINGS={$quality}",
            '-dNOPAUSE',
            '-dQUIET',
            '-dBATCH',
            "-sOutputFile={$outputPath}",
            $inputFile,
        ]);

        $pdfJob->update(['output_path' => $this->upload($outputPath, $pdfJob->id, 'compressed.pdf')]);
    }
}
