<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SeoSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $global = [
            'site_name'        => 'PDFThings',
            'site_description' => 'Merge, split, compress, and convert PDFs online. Fast, free, and private — files deleted after 12 hours.',
            'default_og_image' => '/og/default.png',
            'twitter_handle'   => '@pdfthings',
            'facebook_app_id'  => '',
        ];

        Setting::updateOrCreate(
            ['key' => 'seo_global'],
            ['value' => json_encode($global), 'type' => 'json', 'group' => 'seo', 'description' => 'Global SEO settings for the site']
        );

        $pages = [
            'homepage' => [
                'title'                => 'PDFThings — Free PDF Tools Online',
                'description'          => 'Merge, split, compress, and convert PDFs online. Fast, free, and private — files deleted after 12 hours.',
                'og_title'             => 'PDFThings — Free Online PDF Tools',
                'og_description'       => 'Merge, split, compress, and convert PDFs online. No signup required. Files deleted after 12 hours.',
                'og_image'             => '/og/default.png',
                'twitter_title'        => 'PDFThings — Free PDF Tools',
                'twitter_description'  => 'Merge, split, compress, and convert PDFs online for free.',
                'keywords'             => ['free pdf tools', 'online pdf editor', 'merge pdf', 'split pdf', 'compress pdf', 'pdf converter'],
                'faq'                  => [
                    ['q' => 'Are PDFThings tools really free?', 'a' => 'Yes. All basic PDF tools are completely free with no signup required. Premium plans offer higher limits for power users.'],
                    ['q' => 'Is my data safe on PDFThings?', 'a' => 'Absolutely. All files are encrypted in transit, processed securely, and automatically deleted after 12 hours. We never access or share your files.'],
                    ['q' => 'What file formats does PDFThings support?', 'a' => 'PDFThings supports PDF, JPG, PNG, and other common image formats. You can merge, split, compress, convert, watermark, and protect PDFs.'],
                ],
            ],
            'pricing' => [
                'title'                => 'Pricing — Free & Premium PDF Tools',
                'description'          => 'PDFThings offers free PDF tools with optional premium plans for higher limits. Start free, upgrade when you need more.',
                'og_title'             => 'PDFThings Pricing — Free & Premium Plans',
                'og_description'       => 'Free PDF tools with no limits on basic usage. Premium plans for power users.',
                'og_image'             => '/og/default.png',
                'twitter_title'        => 'PDFThings Pricing',
                'twitter_description'  => 'Free PDF tools. Premium plans for power users.',
                'keywords'             => ['pdf tools pricing', 'pdf tools free', 'premium pdf tools', 'pdf subscription'],
                'faq'                  => [
                    ['q' => 'Is there a free plan?', 'a' => 'Yes. PDFThings offers generous free limits on all tools. No credit card required.'],
                    ['q' => 'What does the premium plan include?', 'a' => 'Premium plans include higher file size limits, more daily operations, priority processing, and access to all tools.'],
                    ['q' => 'Can I cancel my subscription anytime?', 'a' => 'Yes. You can cancel your subscription at any time from your dashboard. You\'ll retain access until the end of your billing period.'],
                ],
            ],
            'merge-pdf' => [
                'title'                => 'Merge PDF — Combine PDFs Online Free',
                'description'          => 'Merge multiple PDF files into one document. Fast, free, and secure — files deleted after 12 hours.',
                'og_title'             => 'Merge PDF Online Free — PDFThings',
                'og_description'       => 'Combine multiple PDF files into one document. No signup required. Free and secure.',
                'og_image'             => '/og/merge-pdf.png',
                'twitter_title'        => 'Merge PDF — Free Online Tool',
                'twitter_description'  => 'Combine multiple PDFs into one document. Free and secure.',
                'keywords'             => ['merge pdf', 'combine pdf', 'pdf merger', 'merge pdf files free', 'join pdf'],
                'faq'                  => [
                    ['q' => 'Is it safe to merge PDFs online?', 'a' => 'Yes. Your files are encrypted in transit, processed securely, and automatically deleted after 12 hours.'],
                    ['q' => 'How many PDFs can I merge at once?', 'a' => 'You can merge up to 20 PDF files in a single operation on the free plan.'],
                    ['q' => 'Do I need to create an account?', 'a' => 'No. You can merge PDFs immediately without signing up.'],
                ],
            ],
            'split-pdf' => [
                'title'                => 'Split PDF — Extract Pages Online Free',
                'description'          => 'Split a PDF file into multiple documents. Extract specific pages or split by range. Free and secure.',
                'og_title'             => 'Split PDF Online Free — PDFThings',
                'og_description'       => 'Extract pages from PDF files. Split by page range or individual pages.',
                'og_image'             => '/og/split-pdf.png',
                'twitter_title'        => 'Split PDF — Free Online Tool',
                'twitter_description'  => 'Extract pages from PDF files quickly and easily.',
                'keywords'             => ['split pdf', 'extract pdf pages', 'pdf splitter', 'separate pdf pages', 'split pdf free'],
                'faq'                  => [
                    ['q' => 'Can I split a PDF by page range?', 'a' => 'Yes. You can specify exact page ranges to extract from your PDF.'],
                    ['q' => 'Will the quality change after splitting?', 'a' => 'No. The original quality of your PDF pages is preserved exactly.'],
                    ['q' => 'Is there a file size limit?', 'a' => 'Free users can upload PDFs up to 20MB. Premium users can upload up to 100MB.'],
                ],
            ],
            'compress-pdf' => [
                'title'                => 'Compress PDF — Reduce File Size Online Free',
                'description'          => 'Reduce PDF file size without losing quality. Fast, free, and secure compression.',
                'og_title'             => 'Compress PDF Online Free — PDFThings',
                'og_description'       => 'Shrink PDF file size while keeping quality. Fast and free.',
                'og_image'             => '/og/compress-pdf.png',
                'twitter_title'        => 'Compress PDF — Free Online Tool',
                'twitter_description'  => 'Reduce PDF file size without losing quality.',
                'keywords'             => ['compress pdf', 'reduce pdf size', 'shrink pdf', 'pdf compressor', 'compress pdf free'],
                'faq'                  => [
                    ['q' => 'Will compression reduce PDF quality?', 'a' => 'Compression is optimized to reduce file size while maintaining readable quality.'],
                    ['q' => 'How much can I reduce my PDF size?', 'a' => 'Most PDFs are reduced by 30-70% depending on content and images.'],
                    ['q' => 'Is the compression free?', 'a' => 'Yes. Basic PDF compression is completely free with no signup required.'],
                ],
            ],
            'organize-pdf' => [
                'title'                => 'Organize PDF — Rotate & Reorder Pages Online',
                'description'          => 'Reorder, rotate, and delete pages from your PDF. Free online PDF organizer.',
                'og_title'             => 'Organize PDF Pages Online Free — PDFThings',
                'og_description'       => 'Reorder, rotate, and remove pages from PDF files.',
                'og_image'             => '/og/organize-pdf.png',
                'twitter_title'        => 'Organize PDF — Free Online Tool',
                'twitter_description'  => 'Reorder, rotate, and remove pages from PDF files.',
                'keywords'             => ['organize pdf', 'reorder pdf pages', 'rotate pdf', 'delete pdf pages', 'pdf organizer'],
                'faq'                  => [
                    ['q' => 'Can I rotate individual pages?', 'a' => 'Yes. You can rotate any page by 90, 180, or 270 degrees.'],
                    ['q' => 'Can I delete pages from a PDF?', 'a' => 'Yes. Simply select the pages you want to remove and delete them.'],
                    ['q' => 'Will this change the PDF quality?', 'a' => 'No. Reordering and rotating pages does not affect quality.'],
                ],
            ],
            'image-to-pdf' => [
                'title'                => 'Image to PDF — Convert JPG/PNG to PDF Online Free',
                'description'          => 'Convert JPG, PNG, and other images to PDF. Fast, free, and secure.',
                'og_title'             => 'Image to PDF Converter — PDFThings',
                'og_description'       => 'Convert JPG and PNG images to PDF documents. Free and easy.',
                'og_image'             => '/og/image-to-pdf.png',
                'twitter_title'        => 'Image to PDF — Free Converter',
                'twitter_description'  => 'Convert JPG and PNG images to PDF.',
                'keywords'             => ['image to pdf', 'jpg to pdf', 'png to pdf', 'convert image to pdf', 'image to pdf free'],
                'faq'                  => [
                    ['q' => 'What image formats are supported?', 'a' => 'We support JPG, JPEG, PNG, GIF, BMP, and WebP formats.'],
                    ['q' => 'Can I combine multiple images into one PDF?', 'a' => 'Yes. Upload multiple images and they will be combined into a single PDF in order.'],
                    ['q' => 'Is the conversion free?', 'a' => 'Yes. Converting images to PDF is completely free.'],
                ],
            ],
            'pdf-to-image' => [
                'title'                => 'PDF to Image — Export PDF Pages as JPG/PNG Free',
                'description'          => 'Convert PDF pages to JPG or PNG images. Fast, free, and secure.',
                'og_title'             => 'PDF to Image Converter — PDFThings',
                'og_description'       => 'Export PDF pages as high-quality JPG or PNG images.',
                'og_image'             => '/og/pdf-to-image.png',
                'twitter_title'        => 'PDF to Image — Free Converter',
                'twitter_description'  => 'Export PDF pages as JPG or PNG images.',
                'keywords'             => ['pdf to image', 'pdf to jpg', 'pdf to png', 'convert pdf to image', 'pdf to image free'],
                'faq'                  => [
                    ['q' => 'Can I choose between JPG and PNG?', 'a' => 'Yes. You can export PDF pages as either JPG or PNG format.'],
                    ['q' => 'What resolution are the exported images?', 'a' => 'Images are exported at high resolution suitable for printing and sharing.'],
                    ['q' => 'Can I export all pages at once?', 'a' => 'Yes. You can export all pages or select specific pages to convert.'],
                ],
            ],
            'watermark-pdf' => [
                'title'                => 'Watermark PDF — Add Text Watermark Online Free',
                'description'          => 'Add text watermarks to your PDF files. Free online watermark tool.',
                'og_title'             => 'Add Watermark to PDF — PDFThings',
                'og_description'       => 'Add custom text watermarks to PDF files. Free and easy.',
                'og_image'             => '/og/watermark-pdf.png',
                'twitter_title'        => 'Watermark PDF — Free Online Tool',
                'twitter_description'  => 'Add custom text watermarks to PDF files.',
                'keywords'             => ['watermark pdf', 'add watermark', 'pdf watermark', 'text watermark', 'watermark pdf free'],
                'faq'                  => [
                    ['q' => 'Can I customize the watermark text?', 'a' => 'Yes. You can set any custom text for your watermark.'],
                    ['q' => 'Can I choose the watermark position?', 'a' => 'The watermark is placed diagonally across the page for maximum visibility.'],
                    ['q' => 'Will the watermark affect PDF quality?', 'a' => 'No. The original quality of your PDF is preserved.'],
                ],
            ],
            'page-numbers' => [
                'title'                => 'Add Page Numbers to PDF — Free Online',
                'description'          => 'Add page numbers to your PDF files. Choose position and format. Free and secure.',
                'og_title'             => 'Add Page Numbers to PDF — PDFThings',
                'og_description'       => 'Add customizable page numbers to PDF documents.',
                'og_image'             => '/og/page-numbers.png',
                'twitter_title'        => 'Add Page Numbers to PDF — Free',
                'twitter_description'  => 'Add customizable page numbers to PDF documents.',
                'keywords'             => ['add page numbers', 'page numbers pdf', 'number pdf pages', 'pdf page numbers free'],
                'faq'                  => [
                    ['q' => 'Where can I place page numbers?', 'a' => 'You can place page numbers at the bottom center, bottom right, or top of each page.'],
                    ['q' => 'Does it work with existing PDF content?', 'a' => 'Yes. Page numbers are added without affecting existing content.'],
                    ['q' => 'Is adding page numbers free?', 'a' => 'Yes. Adding page numbers to PDFs is completely free.'],
                ],
            ],
            'protect-pdf' => [
                'title'                => 'Protect & Unlock PDF — Password-Protect PDFs Free',
                'description'          => 'Add password protection to your PDF files or remove existing passwords. Free and secure.',
                'og_title'             => 'Protect PDF with Password — PDFThings',
                'og_description'       => 'Add or remove password protection from PDF files.',
                'og_image'             => '/og/protect-pdf.png',
                'twitter_title'        => 'Protect PDF — Free Online Tool',
                'twitter_description'  => 'Add or remove password protection from PDF files.',
                'keywords'             => ['protect pdf', 'password protect pdf', 'lock pdf', 'unlock pdf', 'pdf password free'],
                'faq'                  => [
                    ['q' => 'What encryption is used?', 'a' => 'We use AES-256 encryption, the industry standard for PDF password protection.'],
                    ['q' => 'Can I remove a PDF password?', 'a' => 'Yes. If you know the current password, you can remove it from your PDF.'],
                    ['q' => 'Is password protection free?', 'a' => 'Yes. Adding and removing PDF passwords is completely free.'],
                ],
            ],
            'privacy' => [
                'title'                => 'Privacy Policy',
                'description'          => 'How PDFThings handles your files and data.',
                'og_title'             => 'Privacy Policy — PDFThings',
                'og_description'       => 'Learn how PDFThings protects your privacy and handles your files.',
                'og_image'             => '/og/default.png',
                'twitter_title'        => 'Privacy Policy — PDFThings',
                'twitter_description'  => 'Learn how PDFThings protects your privacy.',
                'keywords'             => ['pdfthings privacy', 'privacy policy', 'data protection', 'file privacy'],
                'faq'                  => [],
            ],
            'terms' => [
                'title'                => 'Terms of Service',
                'description'          => 'Terms governing use of PDFThings.',
                'og_title'             => 'Terms of Service — PDFThings',
                'og_description'       => 'Read the terms and conditions for using PDFThings.',
                'og_image'             => '/og/default.png',
                'twitter_title'        => 'Terms of Service — PDFThings',
                'twitter_description'  => 'Read the terms and conditions for using PDFThings.',
                'keywords'             => ['pdfthings terms', 'terms of service', 'terms and conditions', 'usage terms'],
                'faq'                  => [],
            ],
        ];

        foreach ($pages as $slug => $data) {
            Setting::updateOrCreate(
                ['key' => "seo_{$slug}"],
                ['value' => json_encode($data), 'type' => 'json', 'group' => 'seo', 'description' => "SEO settings for {$slug} page"]
            );
        }
    }
}
