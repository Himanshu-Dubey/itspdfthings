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
        $layer      = ($options['layer'] ?? 'above') === 'below' ? 'below' : 'above';
        $outputPath = $scratchDir.'/watermarked.pdf';

        $fillColor = sprintf('rgba(128,128,128,%.2f)', $opacity);

        if ($layer === 'above') {
            // Above: stamp text directly on each page with ImageMagick (always on top)
            $this->exec([
                $this->tool('imagemagick'),
                '-density', '150',
                $inputFile,
                '-gravity',    'Center',
                '-font',       'Noto-Sans-Bold',
                '-pointsize',  '60',
                '-fill',       $fillColor,
                '-annotate',   (string) $angle,
                $text,
                $outputPath,
            ]);
        } else {
            // Below: create transparent overlay PDF, then qpdf --underlay
            $this->watermarkBelow($inputFile, $text, $opacity, $angle, $outputPath, $scratchDir);
        }

        $pdfJob->update(['output_path' => $this->upload($outputPath, $pdfJob->id, 'watermarked.pdf')]);
    }

    private function watermarkBelow(string $inputFile, string $text, float $opacity, int $angle, string $outputPath, string $scratchDir): void
    {
        $gs = $this->tool('ghostscript');

        // Get page dimensions
        $pageWidth = 612.0;
        $pageHeight = 792.0;
        $infoProc = new \Symfony\Component\Process\Process([$this->tool('qpdf'), '--json', $inputFile]);
        $infoProc->run();
        if ($infoProc->isSuccessful()) {
            $json = json_decode($infoProc->getOutput(), true);
            $pages = $json['pages'] ?? [];
            $first = reset($pages) ?: [];
            if (!empty($first['MediaBox'])) {
                $pageWidth = (float) $first['MediaBox'][2];
                $pageHeight = (float) $first['MediaBox'][3];
            }
        }

        $cx = $pageWidth / 2;
        $cy = $pageHeight / 2;
        $grey = number_format(1.0 - $opacity, 2, '.', '');

        $psText = str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $text);

        $overlayPdf = $scratchDir.'/overlay.pdf';
        $psFile = $scratchDir.'/overlay.ps';

        // Write PS file — text only, no background rectangle
        $ps = "%!PS-Adobe-3.0\n"
            ."%%Pages: 1\n"
            ."%%Page: 1 1\n"
            ."%%BoundingBox: 0 0 {$pageWidth} {$pageHeight}\n"
            ."/NimbusSans-Bold findfont 60 scalefont setfont\n"
            .{$grey}." setgray\n"
            .{$cx}." ".$cy." translate\n"
            .{$angle}." rotate\n"
            ."({$psText}) stringwidth\n"
            ."pop 2 div neg -25 moveto\n"
            ."({$psText}) show\n"
            ."%%EOF\n";

        file_put_contents($psFile, $ps);

        // Convert PS → single-page PDF
        $this->exec([
            $gs,
            '-q', '-dNOPAUSE', '-dBATCH', '-dSAFER',
            '-sDEVICE=pdfwrite',
            "-dDEVICEWIDTHPOINTS={$pageWidth}", "-dDEVICEHEIGHTPOINTS={$pageHeight}",
            '-sOutputFile='.$overlayPdf,
            $psFile,
        ]);

        // Underlay onto every page
        $this->exec([
            $this->tool('qpdf'),
            $inputFile,
            '--underlay', $overlayPdf, '--repeat=1-1',
            '--', $outputPath,
        ]);
    }
}
