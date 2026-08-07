import { Droplet } from "lucide-react";
import { makeTool, type PlatformSeed } from "../platformFactory";
import type { ProgrammaticTool } from "../types";

const seed: PlatformSeed = {
  slug: "watermark-pdf",
  label: "Watermark PDF",
  canonicalPath: "/watermark-pdf",
  toolConfig: {
    toolType: "watermark",
    label: "Add Watermark",
    accept: ".pdf,application/pdf",
    fields: [
      {
        name: "text",
        label: "Watermark text",
        type: "text",
        placeholder: "e.g. CONFIDENTIAL",
        required: true,
      },
      {
        name: "opacity",
        label: "Opacity",
        type: "select",
        defaultValue: "0.25",
        options: [
          { value: "0.10", label: "Very faint (10%)" },
          { value: "0.25", label: "Light (25%) - recommended" },
          { value: "0.50", label: "Medium (50%)" },
          { value: "0.75", label: "Dark (75%)" },
        ],
      },
      {
        name: "angle",
        label: "Angle",
        type: "select",
        defaultValue: "45",
        options: [
          { value: "0", label: "Horizontal (0°)" },
          { value: "45", label: "Diagonal (45°) - recommended" },
          { value: "90", label: "Vertical (90°)" },
        ],
      },
      {
        name: "placement",
        label: "Placement",
        type: "select",
        defaultValue: "above",
        options: [
          { value: "above", label: "Above content (on top)" },
          { value: "below", label: "Below content (behind)" },
        ],
      },
    ],
  },
  verb: "Watermark",
  noun: "a PDF",
  actionLabel: "Add Watermark",
  desc: "Add custom text watermarks to PDF files.",
  fileLimit: "up to 20 PDFs per job",
  includeWithoutWatermark: false,
  keywordsBase: "watermark pdf",
  intro: [
    "A watermark marks ownership or sensitivity — your name, a company name, or a word like CONFIDENTIAL across every page. It discourages unauthorized copying and makes it clear who a document belongs to.",
    "This tool adds a text watermark with full control: choose the text, opacity (10-75%), angle (horizontal, diagonal, or vertical), and whether it sits above or below the content. Clean, professional output, and uploads auto-delete within 12 hours.",
  ],
  benefits: [
    { title: "Full text control", body: "Set your watermark text — a name, brand, or word like CONFIDENTIAL." },
    { title: "Adjust opacity", body: "Choose 10% for a subtle mark or 75% for an unmistakable one." },
    { title: "Choose angle and placement", body: "Diagonal, horizontal, or vertical — above or below the content." },
    { title: "Mark every page", body: "Your watermark is applied across the whole document in one pass." },
  ],
  steps: [
    { title: "Upload your PDF", body: "Select the PDF you want to watermark." },
    { title: "Set your watermark", body: "Enter the text, then choose opacity, angle, and placement." },
    { title: "Watermark and download", body: "Run the tool and download the watermarked PDF." },
  ],
  faq: [
    { q: "Can I watermark with my name or company name?", a: "Yes. Enter any text — a name, brand, or notice like CONFIDENTIAL." },
    { q: "Can I make the watermark subtle?", a: "Yes. Choose 10% or 25% opacity for a light mark that doesn't obscure content." },
    { q: "Does the watermark cover my content?", a: "Only if you choose a dark opacity. Light settings keep content fully readable." },
  ],
};

const tool = makeTool(seed);

export const watermarkPdfTool: ProgrammaticTool = {
  ...tool,
  variants: [
    ...tool.variants,
    // ── Audience variants ────────────────────────────────────────────────
    {
      slug: "for-students",
      label: "For Students",
      h1: "Watermark PDF for Students",
      metaTitle: "Watermark PDF for Students — Protect Notes & Drafts",
      metaDescription:
        "Watermark PDFs for students: mark notes, drafts, and documents with your name before sharing. Free, no signup, no watermark-on-output. Files auto-delete in 12 hours.",
      heroDescription:
        "Watermark PDFs for students — mark your notes, drafts, and documents with your name so shared files are clearly yours. Free and easy.",
      icon: Droplet,
      intro: [
        "Sharing notes with a study group is common — but so is seeing your work shared elsewhere without credit. Adding your name as a watermark makes it clear who the document belongs to before you send it.",
        "Add your name or a note like DRAFT across every page at a subtle opacity, so it protects your work without obscuring it.",
      ],
      benefits: [
        { title: "Mark your work", body: "Add your name so shared notes and drafts are clearly yours." },
        { title: "Subtle protection", body: "Use light opacity so the watermark doesn't distract from content." },
        { title: "Mark drafts clearly", body: "Watermark DRAFT on documents still in progress." },
        { title: "Free and instant", body: "No signup — watermark in seconds before sharing." },
      ],
      steps: [
        { title: "Upload your PDF", body: "Select the notes or document you want to watermark." },
        { title: "Enter your name or notice", body: "Type your name or DRAFT, and choose a light opacity." },
        { title: "Watermark and share", body: "Download the marked file and share it with confidence." },
      ],
      faq: [
        { q: "Can I watermark study notes with my name?", a: "Yes. Add your name at a light opacity so notes stay readable." },
        { q: "Will a light watermark obscure my notes?", a: "No. 10-25% opacity marks the document without hiding content." },
        { q: "Can I remove the watermark later?", a: "You can re-run on the original file, but the watermarked copy keeps the mark." },
      ],
      keywords: ["watermark pdf for students", "add name to pdf student", "mark draft pdf", "protect notes with watermark"],
      related: ["for-teachers", "free", "online"],
    },
    {
      slug: "for-teachers",
      label: "For Teachers",
      h1: "Watermark PDF for Teachers",
      metaTitle: "Watermark PDF for Teachers — Mark Materials With Your Name",
      metaDescription:
        "Watermark PDFs for teachers: mark worksheets and exam papers with your name or school before sharing. Free, no signup. Files auto-delete in 12 hours.",
      heroDescription:
        "Watermark PDFs for teachers — mark worksheets, exam papers, and resources with your name or school so shared materials stay attributed.",
      icon: Droplet,
      intro: [
        "Resources shared between teachers, on school drives, or with students can lose their attribution quickly. A subtle watermark with your name or school keeps credit clear.",
        "Mark worksheets, exam papers, and handouts with your name or school name at a light opacity — professional, and no watermark is added by the tool itself.",
      ],
      benefits: [
        { title: "Keep your attribution", body: "Watermark your name or school so shared resources stay credited." },
        { title: "Mark exam papers", body: "Add your initials or department before distributing a paper." },
        { title: "Professional look", body: "A light diagonal watermark looks clean and intentional." },
        { title: "Print-friendly", body: "Watermarked files still print sharply for handouts." },
      ],
      steps: [
        { title: "Upload your PDF", body: "Select the worksheet, exam, or resource to watermark." },
        { title: "Enter your name or school", body: "Type your name, initials, or school name at light opacity." },
        { title: "Watermark and share", body: "Download the marked file and share it with attribution intact." },
      ],
      faq: [
        { q: "Can I watermark with my school's name?", a: "Yes. Enter any text — your name, initials, or school name." },
        { q: "Will the watermark interfere with printing?", a: "No. A light watermark prints fine and doesn't obscure content." },
        { q: "Is this tool itself watermarking my files?", a: "No. The only watermark on your output is the one you add." },
      ],
      keywords: ["watermark pdf for teachers", "add name to worksheet pdf", "watermark exam papers", "mark resources pdf"],
      related: ["for-students", "free", "online"],
    },
    {
      slug: "for-lawyers",
      label: "For Lawyers",
      h1: "Watermark PDF for Lawyers",
      metaTitle: "Watermark PDF for Lawyers — Mark Documents CONFIDENTIAL",
      metaDescription:
        "Watermark PDFs for legal professionals: mark documents CONFIDENTIAL, DRAFT, or privileged before sharing. Encrypted, auto-deleted in 12 hours.",
      heroDescription:
        "Watermark PDFs for lawyers — stamp CONFIDENTIAL, DRAFT, or PRIVILEGED across every page before sharing drafts, opinions, or case documents. Encrypted and auto-deleted within 12 hours.",
      icon: Droplet,
      intro: [
        "Legal documents are shared between counsel, clients, and courts — and a missing CONFIDENTIAL or DRAFT marking can have real consequences. A watermark makes the status of a document unmistakable on every page.",
        "Stamp your watermark across the whole document: CONFIDENTIAL, DRAFT, PRIVILEGED, or a firm name. Control opacity and angle, and trust that transfers are encrypted and files auto-delete within 12 hours.",
      ],
      benefits: [
        { title: "Stamp CONFIDENTIAL", body: "Mark every page of a document with CONFIDENTIAL or PRIVILEGED." },
        { title: "Mark drafts", body: "Watermark DRAFT so recipients know a document isn't final." },
        { title: "Firm attribution", body: "Add your firm's name to materials you circulate." },
        { title: "Secure by design", body: "Encrypted transfers and automatic deletion within 12 hours." },
      ],
      steps: [
        { title: "Upload the document", body: "Select the draft, opinion, or case document to watermark." },
        { title: "Enter the notice", body: "Type CONFIDENTIAL, DRAFT, PRIVILEGED, or your firm name." },
        { title: "Watermark and share", body: "Download the marked file and circulate it with its status clear." },
      ],
      faq: [
        { q: "Can I mark a document CONFIDENTIAL?", a: "Yes. Add the word as your watermark and it appears across every page." },
        { q: "Can the watermark be subtle on legal docs?", a: "Yes. Choose light opacity so it's visible without obscuring text." },
        { q: "Is it appropriate to use an online tool for legal documents?", a: "Transfers are encrypted and files auto-delete within 12 hours. For confidential matters, follow your firm's policy." },
      ],
      keywords: ["watermark pdf for lawyers", "stamp confidential pdf", "watermark legal documents", "mark draft pdf legal"],
      related: ["free", "online", "for-windows"],
    },
  ],
};
