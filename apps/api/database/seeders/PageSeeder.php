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

<p>PDFThings is a free, privacy-first suite of PDF tools designed to make working with PDFs simple and accessible for everyone.</p>

<h3>Our Mission</h3>
<p>We believe PDF tools should be free, fast, and private. No sign-ups, no watermarks, no catches.</p>

<h3>Why Choose PDFThings?</h3>
<ul>
<li><strong>Free:</strong> All core tools are completely free with no hidden charges.</li>
<li><strong>Fast:</strong> Most operations complete in under a second.</li>
<li><strong>Private:</strong> Your files are encrypted, processed securely, and deleted after 12 hours.</li>
<li><strong>Simple:</strong> No account required. Just upload, process, and download.</li>
</ul>

<h3>Our Tools</h3>
<p>We offer 9 powerful PDF tools:</p>
<ul>
<li>Merge PDF - Combine multiple PDFs into one</li>
<li>Split PDF - Extract pages from a PDF</li>
<li>Compress PDF - Reduce file size</li>
<li>Organize PDF - Reorder, rotate, and delete pages</li>
<li>Image to PDF - Convert images to PDF</li>
<li>PDF to Image - Export PDF pages as images</li>
<li>Watermark PDF - Add watermarks to PDFs</li>
<li>Page Numbers - Add page numbers to PDFs</li>
<li>Protect PDF - Add or remove password protection</li>
</ul>

<h3>Contact Us</h3>
<p>Have questions or feedback? We would love to hear from you.</p>',
                'meta_title'       => 'About PDFThings - Free Online PDF Tools',
                'meta_description' => 'Learn about PDFThings, a free privacy-first suite of online PDF tools.',
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
