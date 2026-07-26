<?php

namespace App\Jobs;

use App\Models\PdfJob;

class WatermarkPdfJob extends ProcessPdfJob
{
    private const DPI = 200;

    protected function process(PdfJob $pdfJob, string $scratchDir): void
    {
        $inputFile  = $this->download($pdfJob->input_path, $scratchDir);
        $options    = $pdfJob->options ?? [];
        $text       = $options['text']     ?? 'DRAFT';
        $opacity    = max(0.05, min(1.0, (float) ($options['opacity'] ?? 0.25)));
        $angle      = (int) ($options['angle']  ?? 45);
        $layer      = ($options['layer'] ?? 'above') === 'below' ? 'below' : 'above';
        $outputPath = $scratchDir.'/watermarked.pdf';

        $fillR = 128; $fillG = 128; $fillB = 128;
        $fillColor = sprintf('rgba(%d,%d,%d,%.2f)', $fillR, $fillG, $fillB, $opacity);
        $pointsize = (int) round(60 * (self::DPI / 72));

        $pageCount = $this->getPageCount($inputFile);

        for ($i = 0; $i < $pageCount; $i++) {
            $pageFile    = $scratchDir.'/page_'.$i.'.png';
            $annotated   = $scratchDir.'/wm_page_'.$i.'.png';

            // 1. Rasterize this page
            $this->exec([
                $this->tool('imagemagick'),
                '-density', (string) self::DPI,
                $inputFile.'['.$i.']',
                '-alpha', 'remove',
                '-alpha', 'off',
                $pageFile,
            ]);

            if ($layer === 'below') {
                $dims    = @getimagesize($pageFile);
                $w       = $dims ? $dims[0] : 2480;
                $h       = $dims ? $dims[1] : 3508;

                // 1. Create watermark layer: white bg + grey watermark text
                $wmLayer = $scratchDir.'/wm_layer_'.$i.'.png';
                $this->exec([
                    $this->tool('imagemagick'),
                    '-size', $w.'x'.$h, 'xc:white',
                    '-gravity',    'Center',
                    '-font',       'Noto-Sans-Bold',
                    '-pointsize',  (string) $pointsize,
                    '-fill',       $fillColor,
                    '-annotate',   (string) $angle,
                    $text,
                    $wmLayer,
                ]);

                // 2. Remove white bg from original → transparent (content only)
                $contentFile = $scratchDir.'/content_'.$i.'.png';
                $this->exec([
                    $this->tool('imagemagick'),
                    $pageFile,
                    '-fuzz', '8%',
                    '-transparent', 'white',
                    $contentFile,
                ]);

                // 3. Composite: content on top of watermark → watermark shows behind
                $this->exec([
                    $this->tool('imagemagick'),
                    $wmLayer,
                    $contentFile,
                    '-gravity', 'center',
                    '-composite',
                    $annotated,
                ]);
            } else {
                // "above" — annotate directly on the rasterized page (watermark on top)
                $this->exec([
                    $this->tool('imagemagick'),
                    $pageFile,
                    '-gravity',    'Center',
                    '-font',       'Noto-Sans-Bold',
                    '-pointsize',  (string) $pointsize,
                    '-fill',       $fillColor,
                    '-annotate',   (string) $angle,
                    $text,
                    $annotated,
                ]);
            }
        }

        // Merge all annotated pages into a single PDF
        $pages = [];
        for ($i = 0; $i < $pageCount; $i++) {
            $pages[] = $scratchDir.'/wm_page_'.$i.'.png';
        }

        $this->exec(array_merge([
            $this->tool('imagemagick'),
            '-density', (string) self::DPI,
        ], $pages, [$outputPath]));

        $pdfJob->update(['output_path' => $this->upload($outputPath, $pdfJob->id, 'watermarked.pdf')]);
    }

    private function getPageCount(string $pdfPath): int
    {
        $process = new \Symfony\Component\Process\Process([
            $this->tool('qpdf'), '--show-npages', $pdfPath,
        ]);
        $process->run();

        if (! $process->isSuccessful()) {
            return 1;
        }

        return max(1, (int) trim($process->getOutput()));
    }
}
