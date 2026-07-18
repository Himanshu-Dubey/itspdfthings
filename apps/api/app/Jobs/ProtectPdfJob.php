<?php

namespace App\Jobs;

use App\Models\PdfJob;

class ProtectPdfJob extends ProcessPdfJob
{
    protected function process(PdfJob $pdfJob, string $scratchDir): void
    {
        $inputFile  = $this->download($pdfJob->input_path, $scratchDir);
        $options    = $pdfJob->options ?? [];
        $action     = $options['action']   ?? 'protect';
        $password   = $options['password'] ?? '';
        $outputPath = $scratchDir.'/output.pdf';

        if ($action === 'unlock') {
            // Attempt to decrypt; password may be empty for unlocked PDFs.
            $args = [$this->tool('qpdf')];
            if ($password !== '') {
                $args[] = "--password={$password}";
            }
            $args[] = '--decrypt';
            $args[] = $inputFile;
            $args[] = $outputPath;
            $this->exec($args);
        } else {
            // Encrypt with 256-bit AES; user & owner password are the same.
            if ($password === '') {
                throw new \InvalidArgumentException('A password is required to protect a PDF.');
            }
            $this->exec([
                $this->tool('qpdf'),
                '--encrypt', $password, $password, '256',
                '--',
                $inputFile,
                $outputPath,
            ]);
        }

        $label = $action === 'unlock' ? 'unlocked.pdf' : 'protected.pdf';
        $pdfJob->update(['output_path' => $this->upload($outputPath, $pdfJob->id, $label)]);
    }
}
