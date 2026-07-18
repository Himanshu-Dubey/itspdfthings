<?php

namespace App\Jobs;

use App\Models\PdfJob;

class AddPageNumbersJob extends ProcessPdfJob
{
    private const GRAVITY_MAP = [
        'bottom-center' => 'South',
        'bottom-left'   => 'SouthWest',
        'bottom-right'  => 'SouthEast',
    ];

    protected function process(PdfJob $pdfJob, string $scratchDir): void
    {
        $inputFile = $this->download($pdfJob->input_path, $scratchDir);
        $options   = $pdfJob->options ?? [];
        $position  = self::GRAVITY_MAP[$options['position'] ?? ''] ?? self::GRAVITY_MAP['bottom-center'];
        $startAt   = max(1, (int) ($options['start_at'] ?? 1));

        // Rasterise every page, then stamp each one with its number individually.
        $this->exec([
            $this->tool('imagemagick'),
            '-density', '150',
            $inputFile,
            $scratchDir.'/page.png',
        ]);

        $pages = glob($scratchDir.'/page*.png') ?: [];
        natsort($pages);
        $pages = array_values($pages);

        foreach ($pages as $i => $page) {
            $this->exec([
                $this->tool('imagemagick'),
                $page,
                '-gravity', $position,
                '-pointsize', '24',
                '-fill', 'black',
                '-annotate', '+0+12',
                (string) ($startAt + $i),
                $page,
            ]);
        }

        $outputPath = $scratchDir.'/numbered.pdf';
        $this->exec(array_merge([$this->tool('imagemagick')], $pages, [$outputPath]));

        $pdfJob->update(['output_path' => $this->upload($outputPath, $pdfJob->id, 'numbered.pdf')]);
    }
}
