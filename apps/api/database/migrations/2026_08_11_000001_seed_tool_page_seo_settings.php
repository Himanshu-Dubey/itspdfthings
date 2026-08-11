<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $toolSeo = [
            'merge-pdf' => [
                'title' => 'Merge PDF Files Online Free — No Sign-Up',
                'description' => 'Combine multiple PDF files into one document in seconds. Free, no sign-up, no watermark. Files auto-deleted after 12 hours.',
                'og_title' => 'Merge PDF Online — Free, No Sign-Up | PDFThings',
                'og_description' => 'Combine multiple PDF files into one document in seconds. Free, no sign-up, no watermark.',
                'twitter_title' => 'Merge PDF Online Free',
                'twitter_description' => 'Combine multiple PDF files into one document. Free, no sign-up.',
                'keywords' => ['merge pdf', 'combine pdf', 'pdf merger', 'merge pdf online free'],
                'faq' => [
                    ['q' => 'Is merging PDFs online safe?', 'a' => 'Yes. Files are encrypted in transit and automatically deleted from our servers within 12 hours.'],
                    ['q' => 'Do I need to create an account?', 'a' => 'No. The online merger works without registration. Upload, merge, and download — that\'s it.'],
                    ['q' => 'How many files can I merge at once?', 'a' => 'You can merge up to 20 PDF files in a single job.'],
                ],
            ],
            'split-pdf' => [
                'title' => 'Split PDF Online Free — Extract Pages',
                'description' => 'Split a PDF into separate files or extract specific pages online for free. No sign-up, no software install. Files deleted after 12 hours.',
                'og_title' => 'Split PDF Online Free — Extract Pages | PDFThings',
                'og_description' => 'Split a PDF into separate files or extract specific pages online for free.',
                'twitter_title' => 'Split PDF Online Free',
                'twitter_description' => 'Split a PDF into separate files or extract pages. Free, no sign-up.',
                'keywords' => ['split pdf', 'extract pages', 'pdf splitter', 'split pdf online free'],
                'faq' => [
                    ['q' => 'Can I extract just one page?', 'a' => 'Yes. Enter a single number (e.g. 7) as your range and you\'ll get that page as its own file.'],
                    ['q' => 'Can I split a scanned PDF?', 'a' => 'Yes. Scanned PDFs split exactly like digital ones, page by page.'],
                    ['q' => 'Does splitting remove my original file?', 'a' => 'No. Your original is never modified — splitting always creates new output files.'],
                ],
            ],
            'compress-pdf' => [
                'title' => 'Compress PDF Online Free — Reduce File Size',
                'description' => 'Shrink PDF file size without losing quality. Free online compressor with no sign-up. Choose low, medium, or high compression.',
                'og_title' => 'Compress PDF Online Free | PDFThings',
                'og_description' => 'Shrink PDF file size without losing quality. Free online compressor.',
                'twitter_title' => 'Compress PDF Online Free',
                'twitter_description' => 'Reduce PDF file size without losing quality. Free, no sign-up.',
                'keywords' => ['compress pdf', 'reduce pdf size', 'shrink pdf', 'compress pdf online free'],
                'faq' => [
                    ['q' => 'How much will my PDF shrink?', 'a' => 'Typical savings range from 40-80%, depending on the file\'s images and the level you choose.'],
                    ['q' => 'Will compression hurt quality?', 'a' => 'Text stays sharp. Choose high to preserve near-original quality, or medium for the best balance.'],
                    ['q' => 'Can I compress a scanned PDF?', 'a' => 'Yes. Scanned PDFs often compress the most, since their image-heavy pages have the most to lose.'],
                ],
            ],
            'organize-pdf' => [
                'title' => 'Organize PDF Online Free — Rotate & Reorder Pages',
                'description' => 'Rotate, reorder, or delete PDF pages online for free. No sign-up required. Fix page order or orientation in seconds.',
                'og_title' => 'Organize PDF Online Free | PDFThings',
                'og_description' => 'Rotate, reorder, or delete PDF pages online for free.',
                'twitter_title' => 'Organize PDF Online Free',
                'twitter_description' => 'Fix page order, rotate scans, or delete pages. Free, no sign-up.',
                'keywords' => ['organize pdf', 'reorder pdf pages', 'rotate pdf', 'delete pdf pages'],
                'faq' => [
                    ['q' => 'Can I remove pages from a PDF?', 'a' => 'Yes. Enter only the pages you want to keep — everything else is dropped.'],
                    ['q' => 'Can I rotate a PDF?', 'a' => 'Yes. Rotate all pages 90°, 180°, or 270° in one click.'],
                    ['q' => 'Does organizing change my original?', 'a' => 'No. Your original is never modified — organizing creates new output.'],
                ],
            ],
            'image-to-pdf' => [
                'title' => 'Convert JPG/PNG to PDF Online Free',
                'description' => 'Convert JPG or PNG images to PDF online for free. Combine multiple images into one PDF. No sign-up, no watermark.',
                'og_title' => 'Convert JPG/PNG to PDF Online Free | PDFThings',
                'og_description' => 'Convert JPG or PNG images to PDF online for free.',
                'twitter_title' => 'Convert JPG/PNG to PDF Free',
                'twitter_description' => 'Convert JPG or PNG images to PDF. Free, no sign-up.',
                'keywords' => ['jpg to pdf', 'png to pdf', 'image to pdf', 'convert image to pdf'],
                'faq' => [
                    ['q' => 'What image formats are supported?', 'a' => 'JPG, PNG, WebP, GIF, and TIFF images are supported.'],
                    ['q' => 'Can I convert photos from my phone?', 'a' => 'Yes. Upload photos from your phone and they\'re converted into a PDF.'],
                    ['q' => 'Can I combine images of different sizes?', 'a' => 'Yes. Each image becomes a page in your PDF, fitted to the page.'],
                ],
            ],
            'pdf-to-image' => [
                'title' => 'Convert PDF to JPG/PNG Online Free',
                'description' => 'Convert PDF pages to JPG or PNG images online for free. Export individual pages or the whole document. No sign-up required.',
                'og_title' => 'Convert PDF to JPG/PNG Online Free | PDFThings',
                'og_description' => 'Convert PDF pages to JPG or PNG images online for free.',
                'twitter_title' => 'Convert PDF to JPG/PNG Free',
                'twitter_description' => 'Export PDF pages as JPG or PNG images. Free, no sign-up.',
                'keywords' => ['pdf to jpg', 'pdf to png', 'pdf to image', 'convert pdf to image'],
                'faq' => [
                    ['q' => 'What\'s the difference between JPG and PNG output?', 'a' => 'JPG gives smaller files with slight compression; PNG is lossless and better for text or graphics.'],
                    ['q' => 'What DPI should I choose?', 'a' => '150 DPI is best for most uses; choose 300 DPI for print and 72 DPI for quick screen sharing.'],
                    ['q' => 'Does each page become a separate image?', 'a' => 'Yes. Every PDF page is exported as its own JPG or PNG file.'],
                ],
            ],
            'watermark-pdf' => [
                'title' => 'Add Watermark to PDF Online Free',
                'description' => 'Add a text or image watermark to your PDF online for free. Mark documents as draft, confidential, or branded in seconds.',
                'og_title' => 'Add Watermark to PDF Online Free | PDFThings',
                'og_description' => 'Add a text or image watermark to your PDF online for free.',
                'twitter_title' => 'Add Watermark to PDF Free',
                'twitter_description' => 'Add text watermark to PDF. Free, no sign-up.',
                'keywords' => ['watermark pdf', 'add watermark', 'pdf watermark', 'stamp pdf'],
                'faq' => [
                    ['q' => 'Can I watermark with my name or company name?', 'a' => 'Yes. Enter any text — a name, brand, or notice like CONFIDENTIAL.'],
                    ['q' => 'Can I make the watermark subtle?', 'a' => 'Yes. Choose 10% or 25% opacity for a light mark that doesn\'t obscure content.'],
                    ['q' => 'Does the watermark cover my content?', 'a' => 'Only if you choose a dark opacity. Light settings keep content fully readable.'],
                ],
            ],
            'page-numbers' => [
                'title' => 'Add Page Numbers to PDF Online Free',
                'description' => 'Add sequential page numbers to your PDF online for free. Choose position and starting number. No sign-up required.',
                'og_title' => 'Add Page Numbers to PDF Online Free | PDFThings',
                'og_description' => 'Add sequential page numbers to your PDF online for free.',
                'twitter_title' => 'Add Page Numbers to PDF Free',
                'twitter_description' => 'Add page numbers to PDF. Free, no sign-up.',
                'keywords' => ['add page numbers', 'pdf page numbers', 'number pdf pages', 'page numbers pdf'],
                'faq' => [
                    ['q' => 'Can I start numbering at a number other than 1?', 'a' => 'Yes. Set the start number — useful when covers or appendices come first.'],
                    ['q' => 'Where can the page numbers go?', 'a' => 'Bottom center, bottom left, or bottom right of each page.'],
                    ['q' => 'Will adding numbers change my content?', 'a' => 'No. Only the page numbers are added — your content stays untouched.'],
                ],
            ],
            'protect-pdf' => [
                'title' => 'Password Protect or Unlock PDF Online Free',
                'description' => 'Add or remove a password from your PDF online for free. Encrypt sensitive documents or unlock files you own. No sign-up needed.',
                'og_title' => 'Password Protect PDF Online Free | PDFThings',
                'og_description' => 'Add or remove a password from your PDF online for free.',
                'twitter_title' => 'Password Protect PDF Free',
                'twitter_description' => 'Add or remove PDF password. Free, no sign-up.',
                'keywords' => ['password protect pdf', 'encrypt pdf', 'unlock pdf', 'pdf password'],
                'faq' => [
                    ['q' => 'Can I add a password to a PDF?', 'a' => 'Yes. Choose protect, enter a password, and only people with it can open the file.'],
                    ['q' => 'Can I remove a password from a PDF?', 'a' => 'Yes. Choose unlock and provide the existing password.'],
                    ['q' => 'Are my files kept on your servers?', 'a' => 'No. Uploads are encrypted and automatically deleted within 12 hours.'],
                ],
            ],
        ];

        foreach ($toolSeo as $key => $data) {
            DB::table('settings')->updateOrInsert(
                ['key' => "seo_{$key}"],
                ['value' => json_encode($data), 'updated_at' => now()]
            );
        }
    }

    public function down(): void
    {
        $toolKeys = [
            'merge-pdf', 'split-pdf', 'compress-pdf', 'organize-pdf',
            'image-to-pdf', 'pdf-to-image', 'watermark-pdf',
            'page-numbers', 'protect-pdf',
        ];
        foreach ($toolKeys as $key) {
            DB::table('settings')->where('key', "seo_{$key}")->delete();
        }
    }
};
