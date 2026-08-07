import { Minimize2 } from "lucide-react";
import { makeTool, type PlatformSeed } from "../platformFactory";
import type { ProgrammaticTool } from "../types";

const seed: PlatformSeed = {
  slug: "compress-pdf",
  label: "Compress PDF",
  canonicalPath: "/compress-pdf",
  toolConfig: {
    toolType: "compress",
    label: "Compress PDF",
    accept: ".pdf,application/pdf",
    fields: [
      {
        name: "level",
        label: "Compression level",
        type: "select",
        defaultValue: "medium",
        options: [
          { value: "low", label: "Low quality (smallest file)" },
          { value: "medium", label: "Medium quality (recommended)" },
          { value: "high", label: "High quality (minimal compression)" },
        ],
      },
    ],
  },
  verb: "Compress",
  noun: "a PDF",
  actionLabel: "Compress PDF",
  desc: "Reduce PDF file size without losing quality.",
  fileLimit: "up to 20 PDFs per job",
  includeWithoutWatermark: true,
  keywordsBase: "compress pdf",
  intro: [
    "Email servers cap attachments around 20-25MB, and many portals refuse larger files entirely. Compressing a PDF is the fastest fix — it shrinks the file while keeping pages readable and print-quality text sharp.",
    "This tool compresses PDFs at three levels: low for the smallest file, medium for the best balance, and high to preserve near-original quality. Your compressed file downloads clean, without watermark, and uploads auto-delete within 12 hours.",
  ],
  benefits: [
    { title: "Smaller emails", body: "Get attachments under 25MB so they send instead of bouncing back." },
    { title: "Three quality levels", body: "Choose low, medium, or high compression to match how you'll use the file." },
    { title: "Text stays sharp", body: "Compression targets images and bulk data — text and layout remain readable." },
    { title: "Clean output", body: "No watermark is added to your compressed file." },
  ],
  steps: [
    { title: "Upload your PDF", body: "Select the PDF you want to compress and upload it." },
    { title: "Choose a compression level", body: "Pick low for the smallest file, medium for balance, or high for near-original quality." },
    { title: "Compress and download", body: "Run the compression and download the smaller file, ready to email or upload." },
  ],
  faq: [
    { q: "How much will my PDF shrink?", a: "Typical savings range from 40-80%, depending on the file's images and the level you choose." },
    { q: "Will compression hurt quality?", a: "Text stays sharp. Choose high to preserve near-original quality, or medium for the best balance." },
    { q: "Can I compress a scanned PDF?", a: "Yes. Scanned PDFs often compress the most, since their image-heavy pages have the most to lose." },
  ],
};

const tool = makeTool(seed);

export const compressPdfTool: ProgrammaticTool = {
  ...tool,
  variants: [
    ...tool.variants,
    // ── Audience variants ────────────────────────────────────────────────
    {
      slug: "for-students",
      label: "For Students",
      h1: "Compress PDF for Students",
      metaTitle: "Compress PDF for Students — Get Files Under the Email Limit",
      metaDescription:
        "Compress PDFs for students: shrink assignments, slides, and scans to fit email and portal size limits. Free, no watermark, no signup. Files auto-delete in 12 hours.",
      heroDescription:
        "Compress PDFs for students — shrink scanned notes, lecture slides, and assignment PDFs so they fit email and submission-portal size limits. Free and clean output.",
      icon: Minimize2,
      intro: [
        "That 40MB scan of your handwritten notes will bounce off most university email servers, and some portals reject files over a fixed size. Compressing the PDF is the quickest fix before a deadline.",
        "Shrink assignment PDFs, lecture slides, and scans with one click. Choose a level that keeps text readable, and send files that actually go through — no watermark, no signup.",
      ],
      benefits: [
        { title: "Fit email limits", body: "Shrink attachments under university and personal email size caps so they send first time." },
        { title: "Meet portal limits", body: "Compress files to fit Turnitin, Moodle, and Blackboard upload requirements." },
        { title: "Shrink scanned notes", body: "Camera scans and scans of handwritten notes compress dramatically." },
        { title: "Free before deadlines", body: "No signup or watermark, so you can compress in seconds before a midnight deadline." },
      ],
      steps: [
        { title: "Upload your PDF", body: "Select the assignment, scan, or slide deck that's too large to send." },
        { title: "Pick a compression level", body: "Choose medium for balance or low if you need the smallest possible file." },
        { title: "Compress and send", body: "Download the smaller file and email or submit it — it goes through this time." },
      ],
      faq: [
        { q: "Will my professor see a difference in quality?", a: "Text stays sharp. Choose high or medium to keep slides and assignments fully readable." },
        { q: "Can I compress scanned handwritten notes?", a: "Yes. Scans compress especially well, often shrinking by half or more." },
        { q: "Is there a size limit on the original file?", a: "You can compress up to 20 PDFs per job at no cost." },
      ],
      keywords: ["compress pdf for students", "shrink pdf for email", "compress scanned notes pdf", "reduce pdf size for submission"],
      related: ["for-teachers", "free", "without-watermark"],
    },
    {
      slug: "for-teachers",
      label: "For Teachers",
      h1: "Compress PDF for Teachers",
      metaTitle: "Compress PDF for Teachers — Shrink Handouts & LMS Uploads",
      metaDescription:
        "Compress PDFs for teachers: shrink worksheets, exam papers, and scans for LMS and email. Free, no watermark, no signup. Files auto-delete in 12 hours.",
      heroDescription:
        "Compress PDFs for teachers — shrink worksheets, exam papers, and scanned materials so they upload to your LMS and email to parents without size errors.",
      icon: Minimize2,
      intro: [
        "Learning management systems and school email servers routinely reject large PDFs, and scanned worksheets are often huge. A quick compression gets the same material under the limit with pages still fully readable.",
        "Compress worksheets, exam papers, and scanned packets for LMS upload or email. Choose a level that keeps print quality — your handouts stay sharp on the photocopier.",
      ],
      benefits: [
        { title: "Upload to any LMS", body: "Shrink files to fit Google Classroom, Moodle, and other platform limits." },
        { title: "Email handouts to parents", body: "Send worksheets and newsletters that don't bounce from school email servers." },
        { title: "Compress scanned packets", body: "Scanned worksheets and old exams shrink dramatically without losing readability." },
        { title: "Print-quality output", body: "Choose high or medium so materials stay sharp on the photocopier." },
      ],
      steps: [
        { title: "Upload your PDF", body: "Select the worksheet, exam, or scanned packet to compress." },
        { title: "Choose the quality level", body: "Pick high for print materials or medium for files that only need on-screen viewing." },
        { title: "Compress and upload", body: "Download the smaller file and upload or email it — no more size errors." },
      ],
      faq: [
        { q: "Will compressed worksheets still print well?", a: "Yes. Choose high or medium and text and graphics stay sharp for printing." },
        { q: "Can I compress a whole exam paper?", a: "Yes, and answer keys compress the same way in a separate file." },
        { q: "Is there a file limit?", a: "You can compress up to 20 PDFs per job for free." },
      ],
      keywords: ["compress pdf for teachers", "shrink pdf for lms", "compress worksheet pdf", "reduce pdf size for email"],
      related: ["for-students", "free", "online"],
    },
    {
      slug: "for-lawyers",
      label: "For Lawyers",
      h1: "Compress PDF for Lawyers",
      metaTitle: "Compress PDF for Lawyers — Shrink Filings for E-Filing",
      metaDescription:
        "Compress PDFs for legal professionals: shrink large exhibits and filings to meet court and e-filing size limits. Encrypted, auto-deleted in 12 hours.",
      heroDescription:
        "Compress PDFs for lawyers — shrink large exhibits, scanned case files, and filings to meet court and e-filing size limits while keeping text legible. Encrypted and auto-deleted within 12 hours.",
      icon: Minimize2,
      intro: [
        "Courts and e-filing systems routinely cap PDF size — often 25-100MB — and scanned case files blow past these limits quickly. Compressing a filing is the fastest way to make it compliant without re-scanning documents.",
        "This tool compresses scanned exhibits, contracts, and case files to fit filing requirements while keeping text legible. Transfers are encrypted and files auto-delete within 12 hours.",
      ],
      benefits: [
        { title: "Meet e-filing limits", body: "Shrink filings and exhibits to satisfy court and e-filing size caps." },
        { title: "Compress scanned files", body: "Scanned case files compress dramatically without losing text legibility." },
        { title: "Keep documents admissible", body: "Choose high compression to preserve the original appearance of exhibits." },
        { title: "Secure by design", body: "Encrypted transfers and automatic deletion within 12 hours." },
      ],
      steps: [
        { title: "Upload the filing", body: "Select the exhibit, contract, or case file to compress." },
        { title: "Choose the compression level", body: "Use high to preserve appearance, or medium if the file still needs to shrink more." },
        { title: "Compress and file", body: "Download the smaller PDF and upload it to the e-filing system or court portal." },
      ],
      faq: [
        { q: "Will compressed exhibits remain legible?", a: "Yes. Text stays readable, and high compression preserves the appearance of scanned documents." },
        { q: "Is it appropriate to use an online tool for legal documents?", a: "Transfers are encrypted and files auto-delete within 12 hours. For confidential matters, follow your firm's policy." },
        { q: "Can I compress multiple exhibits at once?", a: "Yes. Upload up to 20 PDFs in a single job." },
      ],
      keywords: ["compress pdf for lawyers", "shrink pdf for e-filing", "compress exhibits pdf", "reduce filing pdf size"],
      related: ["without-watermark", "online", "for-windows"],
    },
  ],
};
