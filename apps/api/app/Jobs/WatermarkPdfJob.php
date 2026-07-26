<?php

namespace App\Jobs;

use App\Models\PdfJob;

class WatermarkPdfJob extends ProcessPdfJob
{
    protected function process(PdfJob $pdfJob, string $scratchDir): void
    {
        $inputFile  = $this->download($pdfJob->input_path, $scratchDir);
        $options    = $pdfJob->options ?? [];
        $text       = $options['text']     ?? 'DRAFT';
        $opacity    = max(0.05, min(1.0, (float) ($options['opacity'] ?? 0.25)));
        $angle      = (int) ($options['angle']  ?? 45);
        $outputPath = $scratchDir.'/watermarked.pdf';

        $fillColor = sprintf('rgba(128,128,128,%.2f)', $opacity);

        $this->exec([
            $this->tool('imagemagick'),
            '-density', '150',
            $inputFile,
            '-gravity',    'Center',
            '-pointsize',  '60',
            '-fill',       $fillColor,
            '-annotate',   (string) $angle,
            $text,
            $outputPath,
        ]);

        $pdfJob->update(['output_path' => $this->upload($outputPath, $pdfJob->id, 'watermarked.pdf')]);
    }
}
