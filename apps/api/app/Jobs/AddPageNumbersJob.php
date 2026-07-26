<?php

namespace App\Jobs;

use App\Models\PdfJob;

class AddPageNumbersJob extends ProcessPdfJob
{
    private const POSITIONS = [
        'bottom-center' => [306, 50],
        'bottom-left'   => [72, 50],
        'bottom-right'  => [540, 50],
    ];

    protected function process(PdfJob $pdfJob, string $scratchDir): void
    {
        $inputFile = $this->download($pdfJob->input_path, $scratchDir);
        $options   = $pdfJob->options ?? [];
        $posKey    = $options['position'] ?? 'bottom-center';
        $startAt   = max(1, (int) ($options['start_at'] ?? 1));

        [$x, $y] = self::POSITIONS[$posKey] ?? self::POSITIONS['bottom-center'];

        // Count pages
        $countProc = new \Symfony\Component\Process\Process([
            $this->tool('qpdf'), '--show-npages', $inputFile,
        ]);
        $countProc->run();
        $pageCount = max(1, (int) trim($countProc->getOutput()));

        // Build a multi-page PostScript file — one page per PDF page with its number
        $psLines = ['%!PS-Adobe-3.0', "%%Pages: {$pageCount}"];
        for ($i = 0; $i < $pageCount; $i++) {
            $num   = $startAt + $i;
            $pageN = $i + 1;
            $psLines[] = "%%Page: {$pageN} {$pageN}";
            $psLines[] = '/Helvetica findfont 24 scalefont setfont';
            $psLines[] = '0 0 0 setgray';
            $psLines[] = "{$x} {$y} moveto";
            $psLines[] = "({$num}) show";
            $psLines[] = 'showpage';
        }
        $psLines[] = '%%EOF';

        $psFile = $scratchDir.'/numbers.ps';
        file_put_contents($psFile, implode("\n", $psLines));

        // Convert PS → multi-page PDF (one overlay page per input page)
        $overlayPdf = $scratchDir.'/numbers_overlay.pdf';
        $this->exec([
            $this->tool('ghostscript'),
            '-q', '-dNOPAUSE', '-dBATCH', '-dSAFER',
            '-sDEVICE=pdfwrite',
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
