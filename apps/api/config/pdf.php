<?php

return [
    /*
     * Paths to CLI tools. Override via env on production to specify
     * absolute paths if the binary is not in the system PATH.
     *
     * Windows note: ImageMagick 7 ships as 'magick'; Ghostscript ships as
     * 'gswin64c' (64-bit) or 'gswin32c' (32-bit). Set PDF_TOOL_* accordingly.
     */
    'tools' => [
        'qpdf'        => env('PDF_TOOL_QPDF', 'qpdf'),
        'ghostscript' => env('PDF_TOOL_GHOSTSCRIPT', PHP_OS_FAMILY === 'Windows' ? 'gswin64c' : 'gs'),
        'imagemagick' => env('PDF_TOOL_IMAGEMAGICK', 'magick'),
    ],

    // Allowed MIME types per tool (checked against the detected MIME, not the extension).
    'allowed_mimes' => [
        'merge'       => ['application/pdf'],
        'split'       => ['application/pdf'],
        'compress'    => ['application/pdf'],
        'organize'    => ['application/pdf'],
        'image-to-pdf'=> ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/tiff'],
        'pdf-to-image'=> ['application/pdf'],
        'watermark'   => ['application/pdf'],
        'page-numbers'=> ['application/pdf'],
        'protect'     => ['application/pdf'],
    ],
];
