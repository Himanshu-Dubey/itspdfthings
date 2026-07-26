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
        $layer      = ($options['layer'] ?? 'above') === 'below' ? '--underlay' : '--overlay';
        $outputPath = $scratchDir.'/watermarked.pdf';

        $gs = $this->tool('ghostscript');

        // Get page dimensions from the first page of the input PDF using qpdf
        $pageWidth  = 612.0;
        $pageHeight = 792.0;
        $infoProc = new \Symfony\Component\Process\Process([
            $this->tool('qpdf'), '--show-npages', $inputFile,
        ]);
        $infoProc->run();

        // Try pdfinfo for page dimensions (more reliable)
        $infoProc2 = new \Symfony\Component\Process\Process(['pdfinfo', $inputFile]);
        $infoProc2->run();
        if ($infoProc2->isSuccessful()) {
            if (preg_match('/Page size:\s+([\d.]+)\s+x\s+([\d.]+)/', $infoProc2->getOutput(), $m)) {
                $pageWidth  = (float) $m[1];
                $pageHeight = (float) $m[2];
            }
        }

        $cx = $pageWidth / 2;
        $cy = $pageHeight / 2;

        // Grey level: 0 = black, 1 = white. Higher opacity → darker text.
        $grey = number_format(1.0 - $opacity, 2, '.', '');

        // Escape text for PostScript string literal
        $psText = str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $text);

        // Create a single-page PDF with centered, rotated watermark text.
        $overlayPdf = $scratchDir.'/overlay.pdf';
        $psContent = <<<PS
%!PS-Adobe-3.0
%%Pages: 1
%%Page: 1 1
%%BoundingBox: 0 0 {$pageWidth} {$pageHeight}
%%PageMedia: {$pageWidth} {$pageHeight}
/Helvetica-Bold findfont 60 scalefont setfont
{$grey} setgray
{$cx} {$cy} translate
{$angle} rotate
({$psText}) stringwidth
pop 2 div neg -25 moveto
({$psText}) show
%%EOF
PS;

        file_put_contents($scratchDir.'/overlay.ps', $psContent);

        // Convert PS → single-page PDF matching input page size
        $this->exec([
            $gs,
            '-q', '-dNOPAUSE', '-dBATCH', '-dSAFER',
            '-sDEVICE=pdfwrite',
            "-dDEVICEWIDTHPOINTS={$pageWidth}", "-dDEVICEHEIGHTPOINTS={$pageHeight}",
            '-sOutputFile='.$overlayPdf,
            $scratchDir.'/overlay.ps',
        ]);

        // Overlay or underlay the watermark PDF onto every page of the input
        $this->exec([
            $this->tool('qpdf'),
            $inputFile,
            $layer, $overlayPdf, '--repeat=1-1',
            '--', $outputPath,
        ]);

        $pdfJob->update(['output_path' => $this->upload($outputPath, $pdfJob->id, 'watermarked.pdf')]);
    }
}
