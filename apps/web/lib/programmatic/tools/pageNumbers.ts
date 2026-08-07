import { Hash } from "lucide-react";
import { makeTool, type PlatformSeed } from "../platformFactory";
import type { ProgrammaticTool } from "../types";

const seed: PlatformSeed = {
  slug: "page-numbers",
  label: "Add Page Numbers",
  canonicalPath: "/page-numbers",
  toolConfig: {
    toolType: "page-numbers",
    label: "Add Page Numbers",
    accept: ".pdf,application/pdf",
    fields: [
      {
        name: "position",
        label: "Position",
        type: "select",
        defaultValue: "bottom-center",
        options: [
          { value: "bottom-center", label: "Bottom center" },
          { value: "bottom-left", label: "Bottom left" },
          { value: "bottom-right", label: "Bottom right" },
        ],
      },
      {
        name: "start",
        label: "Start numbering at",
        type: "number",
        defaultValue: "1",
        min: 1,
      },
    ],
  },
  verb: "Add",
  noun: "page numbers",
  actionLabel: "Add Page Numbers",
  desc: "Add customizable page numbers to PDF documents.",
  fileLimit: "up to 20 PDFs per job",
  includeWithoutWatermark: false,
  keywordsBase: "add page numbers to pdf",
  intro: [
    "Page numbers turn a pile of pages into a proper document. Whether it's a report, a thesis, or a contract that needs to stay in order, numbering every page makes it navigable and professional.",
    "This tool adds page numbers in the position you choose — bottom center, bottom left, or bottom right — and lets you start numbering at any number, which is handy for documents with unnumbered covers or appendices.",
  ],
  benefits: [
    { title: "Three positions", body: "Place numbers at bottom center, bottom left, or bottom right." },
    { title: "Start at any number", body: "Begin at 1, or start later for documents with covers and front matter." },
    { title: "Applied to every page", body: "Every page in the document gets its number in one pass." },
    { title: "Clean output", body: "No watermark is added to your numbered PDF." },
  ],
  steps: [
    { title: "Upload your PDF", body: "Select the document you want to number." },
    { title: "Choose position and start number", body: "Pick bottom center, left, or right, and set the starting number." },
    { title: "Add numbers and download", body: "Run the tool and download your numbered PDF." },
  ],
  faq: [
    { q: "Can I start numbering at a number other than 1?", a: "Yes. Set the start number — useful when covers or appendices come first." },
    { q: "Where can the page numbers go?", a: "Bottom center, bottom left, or bottom right of each page." },
    { q: "Will adding numbers change my content?", a: "No. Only the page numbers are added — your content stays untouched." },
  ],
};

const tool = makeTool(seed);

export const pageNumbersTool: ProgrammaticTool = {
  ...tool,
  variants: [
    ...tool.variants,
    // ── Audience variants ────────────────────────────────────────────────
    {
      slug: "for-students",
      label: "For Students",
      h1: "Add Page Numbers for Students",
      metaTitle: "Add Page Numbers to PDF for Students — Format Dissertations",
      metaDescription:
        "Add page numbers to PDFs for students: number dissertations, reports, and assignments. Free, no signup, no watermark. Files auto-delete in 12 hours.",
      heroDescription:
        "Add page numbers to PDFs for students — format dissertations, reports, and long assignments with clean page numbers in the position your university requires.",
      icon: Hash,
      intro: [
        "Universities usually specify where page numbers go on a dissertation or thesis — often bottom center. Missing or inconsistent numbering is an easy formatting deduction, and fixing it by hand is tedious.",
        "Add page numbers in the position your institution requires, starting at the right number for your front matter. Your content stays untouched, and the output is clean.",
      ],
      benefits: [
        { title: "Meet formatting rules", body: "Place numbers where your university requires — typically bottom center." },
        { title: "Handle front matter", body: "Start numbering after your cover and contents pages using the start number." },
        { title: "Consistent throughout", body: "Every page is numbered in one pass — no missed or repeated numbers." },
        { title: "Free before submission", body: "No signup or watermark, so you can format in seconds." },
      ],
      steps: [
        { title: "Upload your PDF", body: "Select your dissertation, report, or assignment." },
        { title: "Choose position and start", body: "Pick the position your institution requires and set the correct start number." },
        { title: "Number and submit", body: "Download the numbered PDF and submit it." },
      ],
      faq: [
        { q: "Can I start numbering after my cover page?", a: "Yes. Set the start number so the first numbered page is correct after front matter." },
        { q: "Where should dissertation page numbers go?", a: "Most universities require bottom center — choose that position." },
        { q: "Will numbering change my layout?", a: "No. Only numbers are added; your content stays exactly as it is." },
      ],
      keywords: ["add page numbers pdf students", "number dissertation pdf", "page numbers thesis pdf", "format assignment pdf"],
      related: ["for-teachers", "free", "online"],
    },
    {
      slug: "for-teachers",
      label: "For Teachers",
      h1: "Add Page Numbers for Teachers",
      metaTitle: "Add Page Numbers to PDF for Teachers — Order Exam Papers",
      metaDescription:
        "Add page numbers to PDFs for teachers: number exam papers, worksheets, and packets. Free, no signup, no watermark. Files auto-delete in 12 hours.",
      heroDescription:
        "Add page numbers to PDFs for teachers — keep exam papers, worksheet packets, and answer keys in order with clear page numbers.",
      icon: Hash,
      intro: [
        "An exam paper or worksheet packet without page numbers is easy to misorder — especially after printing, photocopying, or scanning. Numbering every page keeps a class set in order from start to finish.",
        "Add page numbers to exam papers, packets, and answer keys in one pass. Position them at the bottom where they're unobtrusive.",
      ],
      benefits: [
        { title: "Keep packets in order", body: "Numbered pages stay in sequence through printing and collating." },
        { title: "Number exam papers", body: "Add page numbers so students don't skip or lose questions." },
        { title: "Mark answer keys", body: "Number answer keys too, so marking stays aligned with questions." },
        { title: "Clean and print-friendly", body: "Numbers print clearly and no watermark is added." },
      ],
      steps: [
        { title: "Upload the PDF", body: "Select the exam, packet, or answer key to number." },
        { title: "Choose position and start", body: "Pick bottom center or a corner, and set the start number." },
        { title: "Number and distribute", body: "Download the numbered PDF and print or upload it." },
      ],
      faq: [
        { q: "Can I number both a test and its answer key?", a: "Yes. Number them separately, or together if you want them aligned." },
        { q: "Do numbers print clearly?", a: "Yes. Numbers are clean and small, so they print well and don't distract." },
        { q: "Can I start numbering at any page?", a: "Yes. Use the start number for packets that include unnumbered cover pages." },
      ],
      keywords: ["add page numbers pdf teachers", "number exam papers pdf", "number worksheet packets pdf", "page numbers answer key"],
      related: ["for-students", "free", "online"],
    },
    {
      slug: "for-lawyers",
      label: "For Lawyers",
      h1: "Add Page Numbers for Lawyers",
      metaTitle: "Add Page Numbers to PDF for Lawyers — Number Filings & Exhibits",
      metaDescription:
        "Add page numbers to PDFs for legal professionals: number filings, exhibits, and bundles for court. Encrypted, auto-deleted in 12 hours.",
      heroDescription:
        "Add page numbers to PDFs for lawyers — number filings, exhibit bundles, and contracts so every page is trackable and in order. Encrypted and auto-deleted within 12 hours.",
      icon: Hash,
      intro: [
        "Courts and counterparties expect every page of a filing or exhibit bundle to be numbered — it makes references, citations, and indices reliable. Unnumbered pages create confusion in a multi-volume matter.",
        "Add page numbers to filings, exhibit bundles, and contracts in one pass. Position them at the bottom, and start at the number your index requires.",
      ],
      benefits: [
        { title: "Reference-ready filings", body: "Numbered pages make it easy to cite, index, and cross-reference." },
        { title: "Number exhibit bundles", body: "Keep exhibits in order so indices and references hold." },
        { title: "Match your index", body: "Set the start number to align with your existing page numbering." },
        { title: "Secure by design", body: "Encrypted transfers and automatic deletion within 12 hours." },
      ],
      steps: [
        { title: "Upload the document", body: "Select the filing, exhibit bundle, or contract to number." },
        { title: "Choose position and start", body: "Pick a bottom position and set the start number to match your index." },
        { title: "Number and file", body: "Download the numbered PDF and file or circulate it." },
      ],
      faq: [
        { q: "Can I number pages to match an existing index?", a: "Yes. Set the start number so numbering aligns with your exhibit or filing index." },
        { q: "Can I number a multi-volume bundle?", a: "Yes. Number each volume's PDF with the correct starting number." },
        { q: "Is it appropriate to use an online tool for legal documents?", a: "Transfers are encrypted and files auto-delete within 12 hours. For confidential matters, follow your firm's policy." },
      ],
      keywords: ["add page numbers pdf lawyers", "number filings pdf", "number exhibits pdf", "page numbers contract bundle"],
      related: ["free", "online", "for-windows"],
    },
  ],
};
