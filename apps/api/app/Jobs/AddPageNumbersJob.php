<?php

namespace App\Jobs;

use App\Models\PdfJob;

class AddPageNumbersJob extends ProcessPdfJob
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
        $posKey    = $options['position'] ?? 'bottom-center';
        $startAt   = max(1, (int) ($options['start_at'] ?? 1));

        // Count pages
        $countProc = new \Symfony\Component\Process\Process([
            $this->tool('qpdf'), '--show-npages', $inputFile,
        ]);
        $countProc->run();
        $pageCount = max(1, (int) trim($countProc->getOutput()));

        // Get page size from first page
        $infoProc = new \Symfony\Component\Process\Process([
            $this->tool('qpdf'), '--show-pages', '--json', $inputFile,
        ]);
        $infoProc->run();
        $pageWidth = 612;
        $pageHeight = 792;
        $info = json_decode($infoProc->getOutput(), true);
        if (isset($info['pages']['1'])) {
            $p = $info['pages']['1'];
            $pageWidth = (int) ($p['MediaBox'][2] ?? 612);
            $pageHeight = (int) ($p['MediaBox'][3] ?? 792);
        }

        // Position coordinates based on actual page size
        // Use 36pt (0.5 inch) margin from edges
        $margin = 36;
        $positions = [
            'bottom-center' => [$pageWidth / 2, $margin],
            'bottom-left'   => [$margin, $margin],
            'bottom-right'  => [$pageWidth - $margin, $margin],
        ];
        [$x, $y] = $positions[$posKey] ?? $positions['bottom-center'];

        // Build a multi-page PostScript file — one page per PDF page with its number
        $psLines = ['%!PS-Adobe-3.0', "%%Pages: {$pageCount}", "%%BoundingBox: 0 0 {$pageWidth} {$pageHeight}"];
        for ($i = 0; $i < $pageCount; $i++) {
            $num   = $startAt + $i;
            $pageN = $i + 1;
            $psLines[] = "%%Page: {$pageN} {$pageN}";
            $psLines[] = "%%PageMedia: {$pageWidth} {$pageHeight}";
            $psLines[] = '/NimbusSans-Regular findfont 12 scalefont setfont';
            $psLines[] = '0 0 0 setgray';

            // Right-align for bottom-right, left-align for bottom-left, center for bottom-center
            if ($posKey === 'bottom-right') {
                $psLines[] = "({$num}) stringwidth pop neg {$x} add {$y} moveto";
            } elseif ($posKey === 'bottom-left') {
                $psLines[] = "{$x} {$y} moveto";
            } else {
                $psLines[] = "({$num}) stringwidth pop 2 div neg {$x} add {$y} moveto";
            }

            $psLines[] = "({$num}) show";
            $psLines[] = 'showpage';
        }
        $psLines[] = '%%EOF';

        $psFile = $scratchDir.'/numbers.ps';
        file_put_contents($psFile, implode("\n", $psLines));

        // Convert PS → multi-page PDF matching the input page size
        $overlayPdf = $scratchDir.'/numbers_overlay.pdf';
        $this->exec([
            $this->tool('ghostscript'),
            '-q', '-dNOPAUSE', '-dBATCH', '-dSAFER',
            '-sDEVICE=pdfwrite',
            "-dDEVICEWIDTHPOINTS={$pageWidth}", "-dDEVICEHEIGHTPOINTS={$pageHeight}",
            '-sOutputFile='.$overlayPdf,
            $psFile,
        ]);

        // Overlay each page onto the corresponding input page
        $outputPath = $scratchDir.'/numbered.pdf';
        $this->exec([
            $this->tool('qpdf'),
            $inputFile,
            '--overlay', $overlayPdf, '--to=1-'.$pageCount, '--from=1-'.$pageCount,
            '--', $outputPath,
        ]);

        $pdfJob->update(['output_path' => $this->upload($outputPath, $pdfJob->id, 'numbered.pdf')]);
    }
}
