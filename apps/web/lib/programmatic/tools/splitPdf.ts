import { Scissors } from "lucide-react";
import { makeTool, type PlatformSeed } from "../platformFactory";
import type { ProgrammaticTool } from "../types";

const seed: PlatformSeed = {
  slug: "split-pdf",
  label: "Split PDF",
  canonicalPath: "/split-pdf",
  toolConfig: {
    toolType: "split",
    label: "Split PDF",
    accept: ".pdf,application/pdf",
    fields: [
      {
        name: "pages",
        label: "Page range (optional)",
        type: "text",
        placeholder: "e.g. 1-3,5,8",
      },
    ],
  },
  verb: "Split",
  noun: "a PDF",
  actionLabel: "Split PDF",
  desc: "Extract pages or split a PDF into separate files.",
  fileLimit: "up to 20 page ranges per job",
  includeWithoutWatermark: true,
  keywordsBase: "split pdf",
  intro: [
    "Splitting a PDF into parts is a daily task for anyone working with long documents: a 60-page contract needs its signature page extracted, a scan needs stray blank pages removed, or a single file needs to become several smaller files for emailing.",
    "This tool splits PDFs by page range — extract pages 1-3 into one file, 5 into another, and 8 into a third, all in a single job. You can also remove unwanted pages entirely. Clean output, no watermark, and files auto-deleted within 12 hours.",
  ],
  benefits: [
    { title: "Split by page range", body: "Specify exact ranges like 1-3, 5, 8-10 and get a separate file for each range in one job." },
    { title: "Remove unwanted pages", body: "Drop blank or duplicate pages by simply not including them in any range." },
    { title: "Keep the originals intact", body: "Your source file is never modified — the split always produces new output files." },
    { title: "Clean, watermark-free output", body: "Every extracted file is clean and ready to email, print, or share." },
  ],
  steps: [
    { title: "Upload your PDF", body: "Select the PDF you want to split and upload it." },
    { title: "Enter your page ranges", body: "Type ranges like 1-3, 5, 8-10. Each range becomes its own output file." },
    { title: "Split and download", body: "Run the split and download the extracted files, each named by its range." },
  ],
  faq: [
    { q: "Can I extract just one page?", a: "Yes. Enter a single number (e.g. 7) as your range and you'll get that page as its own file." },
    { q: "Can I split a scanned PDF?", a: "Yes. Scanned PDFs split exactly like digital ones, page by page." },
    { q: "Does splitting remove my original file?", a: "No. Your original is never modified — splitting always creates new output files." },
  ],
};

const tool = makeTool(seed);

export const splitPdfTool: ProgrammaticTool = {
  ...tool,
  variants: [
    ...tool.variants,
    // ── Audience variants (hand-written, audience-specific) ──────────────
    {
      slug: "for-students",
      label: "For Students",
      h1: "Split PDF for Students",
      metaTitle: "Split PDF for Students — Extract Pages for Submissions",
      metaDescription:
        "Split PDFs for students: extract assignment pages, remove blank scans, or split long lecture notes into sections. Free, no watermark, no signup. Files auto-delete in 12 hours.",
      heroDescription:
        "Split PDFs for students — extract the pages your lecturer wants, remove blank scans before submission, or break a long lecture PDF into digestible sections. Free and clean output.",
      icon: Scissors,
      intro: [
        "Submission day exposes every problem in a PDF: stray blank pages from a scanner, an errant screenshot, or a 40-page reading when your tutor only asked for pages 5-12. A PDF splitter fixes all of these in seconds.",
        "Extract just the pages your assignment requires, remove blanks, or split a long coursepack into chapter-sized files. Each split produces clean, watermark-free pages ready to submit or print.",
      ],
      benefits: [
        { title: "Extract required pages", body: "Submit only pages 5-12 of a reading or a single signature page — exactly what was asked." },
        { title: "Remove blank scans", body: "Drop the blank pages your scanner or camera added before you email or submit." },
        { title: "Split long lecture notes", body: "Break a semester-long PDF into unit-sized files that are easier to study and print." },
        { title: "Free for coursework", body: "No watermark, no signup — split as many files as you need before a deadline." },
      ],
      steps: [
        { title: "Upload your PDF", body: "Select the reading, scan, or assignment file you need to split." },
        { title: "Enter the pages to extract", body: "Type the exact pages (e.g. 5-12) your tutor asked for, or the sections you want as separate files." },
        { title: "Split and submit", body: "Download the extracted pages and submit or print them directly." },
      ],
      faq: [
        { q: "Can I split a scanned PDF of handwritten notes?", a: "Yes. Scanned PDFs split page by page exactly like digital ones." },
        { q: "Will extracted pages have a watermark?", a: "No. Every extracted page is clean and submission-ready." },
        { q: "Can I split a PDF into chapters?", a: "Yes. Enter each chapter's page range and you'll get one file per chapter." },
      ],
      keywords: ["split pdf for students", "extract pages pdf student", "remove blank pages pdf", "split lecture notes pdf"],
      related: ["for-teachers", "free", "without-watermark"],
    },
    {
      slug: "for-teachers",
      label: "For Teachers",
      h1: "Split PDF for Teachers",
      metaTitle: "Split PDF for Teachers — Extract Exam Pages & Worksheets",
      metaDescription:
        "Split PDFs for teachers: extract individual exam pages, separate answer keys, or pull pages from a workbook. Free, no watermark, no signup. Files auto-delete in 12 hours.",
      heroDescription:
        "Split PDFs for teachers — extract an individual exam paper from a question bank, separate an answer key from a test, or pull single pages from a large workbook. Clean output, ready to print.",
      icon: Scissors,
      intro: [
        "Question banks, workbooks, and past papers are often one massive PDF. When you only need page 3 of a 40-page exam or want to hand students the questions but keep the answers, a PDF splitter is essential.",
        "Extract the pages you need, keep the answer key separate, and print exactly what your class sees. No watermark and no signup — just clean pages ready for the copier.",
      ],
      benefits: [
        { title: "Extract single exam pages", body: "Pull one question page from a question-bank PDF without sharing the rest." },
        { title: "Separate answer keys", body: "Split a test into questions and answers so you control what students receive." },
        { title: "Pull from workbooks", body: "Extract individual worksheets or pages from a large compiled workbook." },
        { title: "Print-ready output", body: "Clean, watermark-free pages that are perfect for the photocopier." },
      ],
      steps: [
        { title: "Upload the PDF", body: "Select the exam bank, workbook, or test file you need to split." },
        { title: "Choose the pages to extract", body: "Enter the page ranges you want as separate files — e.g. questions 1-4, answers 5-8." },
        { title: "Split and print", body: "Download the extracted files and print or share them with your class." },
      ],
      faq: [
        { q: "Can I separate an answer key from a test?", a: "Yes. Split the test so the question pages are one file and the answer pages are another." },
        { q: "Can I split scanned worksheets?", a: "Yes. Scanned PDFs split page by page exactly like digital ones." },
        { q: "Are extracted pages clean for printing?", a: "Yes. No watermark or branding is added, so pages are photocopier-ready." },
      ],
      keywords: ["split pdf for teachers", "extract exam pages pdf", "separate answer key pdf", "split workbook pages"],
      related: ["for-students", "free", "online"],
    },
    {
      slug: "for-lawyers",
      label: "For Lawyers",
      h1: "Split PDF for Lawyers",
      metaTitle: "Split PDF for Lawyers — Extract Pages From Contract Bundles",
      metaDescription:
        "Split PDFs for legal professionals: extract a signature page from a contract, separate exhibits, or pull pages from a case file. Encrypted, auto-deleted in 12 hours.",
      heroDescription:
        "Split PDFs for lawyers and paralegals — extract the signature page from a 40-page contract, separate individual exhibits, or pull specific pages from a case file for disclosure. Encrypted and auto-deleted within 12 hours.",
      icon: Scissors,
      intro: [
        "Legal documents rarely come in convenient single pages. A signed contract needs its signature page extracted for a bank or registry; a multi-exhibit bundle needs each exhibit separated for filing; a case file needs specific pages pulled for disclosure.",
        "This tool splits PDFs by exact page range, so you extract precisely the pages required — no more, no less. Transfers are encrypted and all files are auto-deleted within 12 hours.",
      ],
      benefits: [
        { title: "Extract signature pages", body: "Pull the execution page from a contract for banks, registries, or counterparties." },
        { title: "Separate exhibits", body: "Split a multi-exhibit bundle into individual exhibits for filing or disclosure." },
        { title: "Pull case-file pages", body: "Extract specific pages from pleadings or correspondence for discovery." },
        { title: "Secure by design", body: "Encrypted transfers and automatic deletion within 12 hours." },
      ],
      steps: [
        { title: "Upload the document", body: "Select the contract, exhibit bundle, or case file to split." },
        { title: "Enter the pages to extract", body: "Type the exact pages (e.g. the signature page) you need as a separate file." },
        { title: "Split and save securely", body: "Download the extracted pages. Your uploads are deleted within 12 hours." },
      ],
      faq: [
        { q: "Can I extract just the signature page of a contract?", a: "Yes. Find the page number and enter it as your range to get the signature page as its own file." },
        { q: "Is it appropriate to use an online tool for legal documents?", a: "Transfers are encrypted and files auto-delete within 12 hours. For confidential matters, follow your firm's document-handling policy." },
        { q: "Can I split exhibits out of a bundle?", a: "Yes. Enter each exhibit's page range to produce one file per exhibit." },
      ],
      keywords: ["split pdf for lawyers", "extract signature page pdf", "split contract pdf", "separate exhibits pdf"],
      related: ["without-watermark", "online", "for-windows"],
    },
  ],
};
