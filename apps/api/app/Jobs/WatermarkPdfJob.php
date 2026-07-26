<?php

namespace App\Jobs;

use App\Models\PdfJob;

class WatermarkPdfJob extends ProcessPdfJob
{
    private const FONT = '/usr/share/fonts/noto/NotoSans-Bold.ttf';

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

        if ($layer === 'below') {
            $this->processBelow($inputFile, $outputPath, $text, $fillColor, $angle, $scratchDir);
        } else {
            $this->processAbove($inputFile, $outputPath, $text, $fillColor, $angle);
        }

        $pdfJob->update(['output_path' => $this->upload($outputPath, $pdfJob->id, 'watermarked.pdf')]);
    }

    /**
     * Above: direct annotation on PDF — preserves original vector quality.
     */
    private function processAbove(string $inputFile, string $outputPath, string $text, string $fillColor, int $angle): void
    {
        $this->exec([
            $this->tool('imagemagick'),
            '-density', '150',
            $inputFile,
            '-gravity',    'Center',
            '-font',       self::FONT,
            '-pointsize',  '60',
            '-fill',       $fillColor,
            '-annotate',   (string) $angle,
            $text,
            $outputPath,
        ]);
    }

    /**
     * Below: rasterize → transparent content → watermark layer → composite back.
     */
    private function processBelow(string $inputFile, string $outputPath, string $text, string $fillColor, int $angle, string $scratchDir): void
    {
        $dpi       = 200;
        $pointsize = (int) round(60 * ($dpi / 72));
        $pageCount = $this->getPageCount($inputFile);

        for ($i = 0; $i < $pageCount; $i++) {
            $pageFile = $scratchDir.'/page_'.$i.'.png';

            // Rasterize preserving color
            $this->exec([
                $this->tool('imagemagick'),
                '-density', (string) $dpi,
                $inputFile.'['.$i.']',
                '-colorspace', 'sRGB',
                '-type', 'TrueColor',
                '-alpha', 'remove',
                '-alpha', 'off',
                $pageFile,
            ]);

            $dims = @getimagesize($pageFile);
            $w    = $dims ? $dims[0] : 2480;
            $h    = $dims ? $dims[1] : 3508;

            // Watermark layer: white bg + grey text
            $wmLayer = $scratchDir.'/wm_layer_'.$i.'.png';
            $this->exec([
                $this->tool('imagemagick'),
                '-size', $w.'x'.$h, 'xc:white',
                '-colorspace', 'sRGB',
                '-gravity',    'Center',
                '-font',       self::FONT,
                '-pointsize',  (string) $pointsize,
                '-fill',       $fillColor,
                '-annotate',   (string) $angle,
                $text,
                $wmLayer,
            ]);

            // Content with transparent bg
            $contentFile = $scratchDir.'/content_'.$i.'.png';
            $this->exec([
                $this->tool('imagemagick'),
                $pageFile,
                '-colorspace', 'sRGB',
                '-type', 'TrueColorMatte',
                '-fuzz', '8%',
                '-transparent', 'white',
                $contentFile,
            ]);

            // Composite: watermark behind, content on top
            $annotated = $scratchDir.'/wm_page_'.$i.'.png';
            $this->exec([
                $this->tool('imagemagick'),
                $wmLayer,
                $contentFile,
                '-colorspace', 'sRGB',
                '-type', 'TrueColor',
                '-gravity', 'center',
                '-composite',
                $annotated,
            ]);
        }

        // Merge all pages into PDF
        $pages = [];
        for ($i = 0; $i < $pageCount; $i++) {
            $pages[] = $scratchDir.'/wm_page_'.$i.'.png';
        }

        $this->exec(array_merge([
            $this->tool('imagemagick'),
            '-density', (string) $dpi,
            '-colorspace', 'sRGB',
            '-type', 'TrueColor',
        ], $pages, [$outputPath]));
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
