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

        $gs = $this->tool('ghostscript');

        // Grey level: 0 = black, 1 = white. Higher opacity → darker text.
        $grey = number_format(1.0 - $opacity, 2, '.', '');

        // Escape text for PostScript string literal
        $psText = str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $text);

        // Create a single-page PDF with centered, rotated watermark text.
        // Uses Ghostscript's built-in Helvetica-Bold font (no system fonts needed).
        $overlayPdf = $scratchDir.'/overlay.pdf';
        $psContent = <<<PS
%!PS-Adobe-3.0
%%Pages: 1
%%Page: 1 1
%%BoundingBox: 0 0 612 792
/Helvetica-Bold findfont 60 scalefont setfont
{$grey} setgray
306 396 translate
{$angle} rotate
({$psText}) stringwidth
pop 2 div neg -25 moveto
({$psText}) show
%%EOF
PS;

        file_put_contents($scratchDir.'/overlay.ps', $psContent);

        // Convert PS → single-page PDF
        $this->exec([
            $gs,
            '-q', '-dNOPAUSE', '-dBATCH', '-dSAFER',
            '-sDEVICE=pdfwrite',
            '-dDEVICEWIDTHPOINTS=612', '-dDEVICEHEIGHTPOINTS=792',
            '-sOutputFile='.$overlayPdf,
            $scratchDir.'/overlay.ps',
        ]);

        // Overlay the watermark PDF onto every page of the input
        $this->exec([
            $this->tool('qpdf'),
            $inputFile,
            '--overlay', $overlayPdf, '--repeat=1-1',
            '--', $outputPath,
        ]);

        $pdfJob->update(['output_path' => $this->upload($outputPath, $pdfJob->id, 'watermarked.pdf')]);
    }
}
