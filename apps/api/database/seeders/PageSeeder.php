<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'title'            => 'Privacy Policy',
                'slug'             => 'privacy',
                'content'          => '<h2>Privacy Policy</h2>
<p><strong>Last updated:</strong> July 2026</p>

<h3>1. Information We Collect</h3>
<p>PDFThings collects minimal information to provide our service:</p>
<ul>
<li><strong>Account information:</strong> Name and email address when you create an account.</li>
<li><strong>Usage data:</strong> Anonymous analytics about how you use our tools.</li>
<li><strong>Files:</strong> PDF and image files you upload for processing. All files are automatically deleted after 12 hours.</li>
</ul>

<h3>2. How We Use Your Information</h3>
<ul>
<li>To provide and maintain our PDF processing services.</li>
<li>To send you account-related communications.</li>
<li>To improve our tools and user experience.</li>
</ul>

<h3>3. File Privacy</h3>
<p>Your files are encrypted in transit and at rest. We do not access, read, or share your files. All uploaded files and their processed results are permanently deleted after 12 hours.</p>

<h3>4. Data Security</h3>
<p>We implement industry-standard security measures including 256-bit encryption, secure file storage, and regular security audits.</p>

<h3>5. Third-Party Services</h3>
<p>We use Stripe and Razorpay for payment processing. Their privacy policies govern how they handle your payment information.</p>

<h3>6. Cookies</h3>
<p>We use essential cookies for authentication and session management. Analytics cookies are only used with your consent.</p>

<h3>7. Your Rights</h3>
<p>You can access, update, or delete your account at any time from your dashboard. For any concerns, contact our support team.</p>

<h3>8. Changes to This Policy</h3>
<p>We may update this policy from time to time. Significant changes will be communicated via email.</p>',
                'meta_title'       => 'Privacy Policy - PDFThings',
                'meta_description' => 'Learn how PDFThings handles your files and data. We prioritize your privacy.',
                'is_published'     => true,
                'show_in_header'   => false,
                'show_in_footer'   => true,
                'menu_order'       => 1,
            ],
            [
                'title'            => 'Terms of Service',
                'slug'             => 'terms',
                'content'          => '<h2>Terms of Service</h2>
<p><strong>Last updated:</strong> July 2026</p>

<h3>1. Acceptance of Terms</h3>
<p>By accessing or using PDFThings, you agree to be bound by these Terms of Service.</p>

<h3>2. Description of Service</h3>
<p>PDFThings provides free online tools for processing PDF files, including merging, splitting, compressing, converting, watermarking, and protecting PDFs.</p>

<h3>3. User Responsibilities</h3>
<ul>
<li>You are responsible for the files you upload and process.</li>
<li>You must not use our service for illegal purposes.</li>
<li>You must not attempt to abuse or exploit our services.</li>
</ul>

<h3>4. Free Tier Limits</h3>
<p>Free users are limited to a certain number of operations per tool per day and a maximum file size of 20MB. These limits are subject to change.</p>

<h3>5. Intellectual Property</h3>
<p>PDFThings and its tools are owned by PDFThings. You retain full ownership of any files you upload.</p>

<h3>6. Limitation of Liability</h3>
<p>PDFThings is provided "as is" without warranties. We are not liable for any damages arising from the use of our service.</p>

<h3>7. Termination</h3>
<p>We reserve the right to terminate accounts that violate these terms or abuse our service.</p>

<h3>8. Changes to Terms</h3>
<p>We may modify these terms at any time. Continued use of the service constitutes acceptance of updated terms.</p>',
                'meta_title'       => 'Terms of Service - PDFThings',
                'meta_description' => 'Terms and conditions for using PDFThings PDF tools.',
                'is_published'     => true,
                'show_in_header'   => false,
                'show_in_footer'   => true,
                'menu_order'       => 2,
            ],
            [
                'title'            => 'About Us',
                'slug'             => 'about',
                'content'          => '<h2>About PDFThings</h2>

<p>PDFThings is a free, privacy-first suite of online PDF tools designed to make working with PDF files simple and accessible for everyone. Whether you need to merge multiple PDFs into one, split a large document into smaller files, reduce file size for email, or convert images to PDF, PDFThings handles it all directly in your browser — no software installation required.</p>

<h3>Our Mission</h3>
<p>We believe PDF tools should be free, fast, and private. No sign-ups, no watermarks, no catches. PDFThings was built to be a reliable alternative to expensive desktop software like Adobe Acrobat, giving everyone access to professional-grade PDF tools at no cost.</p>

<h3>Why Choose PDFThings?</h3>
<ul>
<li><strong>Free:</strong> All core tools are completely free with no hidden charges. No account required for basic use.</li>
<li><strong>Fast:</strong> Most operations complete in under a second using server-side processing with Ghostscript and Poppler.</li>
<li><strong>Private:</strong> Your files are encrypted with 256-bit TLS encryption in transit, processed securely, and permanently deleted after 12 hours. We never access or share your files.</li>
<li><strong>Simple:</strong> No account required. Just upload, process, and download. Works on any device with a modern browser.</li>
<li><strong>Secure:</strong> Files are encrypted at rest and in transit. We follow industry-standard security practices.</li>
</ul>

<h3>Our 9 PDF Tools</h3>
<p>PDFThings offers a complete set of PDF tools for every common task:</p>

<h4>Merge PDF</h4>
<p>Combine multiple PDF files into a single document. Upload up to 20 files at once, drag to reorder, and merge them in seconds. Perfect for combining reports, invoices, or any multi-file documents.</p>

<h4>Split PDF</h4>
<p>Extract specific pages from a PDF or split an entire document into separate files. Supports page ranges like 1-3, 5, 8-10, or split every page individually. Output files use the original filename.</p>

<h4>Compress PDF</h4>
<p>Reduce PDF file size without losing quality. Ideal for email attachments, web uploads, or meeting file size requirements. Uses Ghostscript-based optimization for the best compression-to-quality ratio.</p>

<h4>Organize PDF</h4>
<p>Rotate pages, reorder them by dragging, or delete unwanted pages from a PDF document. Quick and intuitive page management without any software.</p>

<h4>Image to PDF</h4>
<p>Convert JPG, PNG, and other image formats into a single PDF document. Supports multiple images with drag-and-drop reordering. Great for creating photo albums or combining scanned documents.</p>

<h4>PDF to Image</h4>
<p>Export each page of a PDF as a separate JPG or PNG image. Choose your output format and download individual pages or all pages at once.</p>

<h4>Watermark PDF</h4>
<p>Add text or image watermarks to every page of a PDF. Customize position, opacity, rotation, and size. Protect your documents or add branding effortlessly.</p>

<h4>Page Numbers</h4>
<p>Stamp sequential page numbers on each page of a PDF. Choose the position (bottom-center, bottom-right, top-center, etc.) and starting number.</p>

<h4>Protect PDF</h4>
<p>Add password protection to a PDF or remove an existing password. Keep your sensitive documents secure with industry-standard encryption.</p>

<h3>Who Uses PDFThings?</h3>
<p>PDFThings is used by students, professionals, freelancers, and businesses worldwide. Whether you are a student combining research papers, a professional compressing a report for email, or a business owner protecting sensitive contracts, PDFThings provides the tools you need without the cost or complexity of traditional PDF software.</p>

<h3>Technology</h3>
<p>PDFThings is built with modern web technologies including Next.js for the frontend, Laravel for the API, and Ghostscript with Poppler for server-side PDF processing. All processing happens on secure servers with encrypted file storage.</p>

<h3>Contact Us</h3>
<p>Have questions, feedback, or need support? We would love to hear from you. Visit our website at <a href="https://itspdfthings.com">itspdfthings.com</a> to try our tools or get in touch.</p>',
                'meta_title'       => 'About PDFThings - Free Online PDF Tools',
                'meta_description' => 'Learn about PDFThings, a free privacy-first suite of 9 online PDF tools. Merge, split, compress, convert, watermark, and protect PDFs without installing software.',
                'is_published'     => true,
                'show_in_header'   => true,
                'show_in_footer'   => true,
                'menu_order'       => 0,
            ],
        ];

        foreach ($pages as $data) {
            Page::updateOrCreate(['slug' => $data['slug']], $data);
        }
    }
}
