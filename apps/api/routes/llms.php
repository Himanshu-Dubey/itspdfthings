<?php

use App\Models\Post;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Route;

Route::get('/llms.txt', function (): Response {
    $baseUrl = 'https://itspdfthings.com';

    $tools = [
        ['slug' => 'merge-pdf', 'label' => 'Merge PDF', 'desc' => 'Combine multiple PDF files into one'],
        ['slug' => 'split-pdf', 'label' => 'Split PDF', 'desc' => 'Extract specific pages or split into separate files'],
        ['slug' => 'compress-pdf', 'label' => 'Compress PDF', 'desc' => 'Reduce PDF file size without losing quality'],
        ['slug' => 'organize-pdf', 'label' => 'Organize PDF', 'desc' => 'Rotate, reorder, or delete pages'],
        ['slug' => 'image-to-pdf', 'label' => 'Image to PDF', 'desc' => 'Convert JPG/PNG images to PDF'],
        ['slug' => 'pdf-to-image', 'label' => 'PDF to Image', 'desc' => 'Export PDF pages as JPG/PNG images'],
        ['slug' => 'watermark-pdf', 'label' => 'Watermark PDF', 'desc' => 'Add text or image watermarks'],
        ['slug' => 'page-numbers', 'label' => 'Page Numbers', 'desc' => 'Add page numbers to PDF'],
        ['slug' => 'protect-pdf', 'label' => 'Protect PDF', 'desc' => 'Password-protect or unlock a PDF'],
    ];

    $posts = Post::latestPublished()
        ->select(['title', 'slug', 'excerpt'])
        ->limit(20)
        ->get();

    $lines = [];
    $lines[] = '# PDFThings — Free Online PDF Tools';
    $lines[] = '';
    $lines[] = '> PDFThings (https://itspdfthings.com) is a free, privacy-focused web app for working with PDF files. No signup required. No watermarks. Files auto-deleted after 12 hours.';
    $lines[] = '';
    $lines[] = '## Tools';
    $lines[] = '';
    foreach ($tools as $t) {
        $lines[] = "- [{$t['label']}]({$baseUrl}/{$t['slug']}) — {$t['desc']}";
    }
    $lines[] = '';
    $lines[] = '## Key Features';
    $lines[] = '';
    $lines[] = '- Free with no signup required';
    $lines[] = '- 256-bit encryption for all files';
    $lines[] = '- Files auto-deleted after 12 hours';
    $lines[] = '- Browser-based — no install needed';
    $lines[] = '- Premium plans for higher limits';
    $lines[] = '';
    $lines[] = '## Pricing';
    $lines[] = '';
    $lines[] = '- Free tier: Basic tools, no account required';
    $lines[] = '- Premium: Higher limits and priority processing';

    if ($posts->isNotEmpty()) {
        $lines[] = '';
        $lines[] = '## Blog';
        $lines[] = '';
        foreach ($posts as $post) {
            $excerpt = $post->excerpt ? " — {$post->excerpt}" : '';
            $lines[] = "- [{$post->title}]({$baseUrl}/blog/{$post->slug}){$excerpt}";
        }
    }

    $lines[] = '';
    $lines[] = '## Contact';
    $lines[] = '';
    $lines[] = '- Website: https://itspdfthings.com';
    $lines[] = '- About: https://itspdfthings.com/about';
    $lines[] = '';

    $content = implode("\n", $lines);

    return response($content, 200, [
        'Content-Type'  => 'text/plain; charset=utf-8',
        'Cache-Control' => 'public, max-age=3600',
    ]);
});
