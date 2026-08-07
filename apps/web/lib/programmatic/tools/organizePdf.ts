import { ListOrdered } from "lucide-react";
import { makeTool, type PlatformSeed } from "../platformFactory";
import type { ProgrammaticTool } from "../types";

const seed: PlatformSeed = {
  slug: "organize-pdf",
  label: "Organize PDF",
  canonicalPath: "/organize-pdf",
  toolConfig: {
    toolType: "organize",
    label: "Organize PDF",
    accept: ".pdf,application/pdf",
    fields: [
      {
        name: "pages",
        label: "Pages to keep",
        type: "text",
        placeholder: "e.g. 1-4,6,8",
      },
      {
        name: "rotation",
        label: "Rotation (optional)",
        type: "select",
        defaultValue: "",
        options: [
          { value: "", label: "No rotation" },
          { value: "90:1-z", label: "Rotate all 90° clockwise" },
          { value: "180:1-z", label: "Rotate all 180°" },
          { value: "270:1-z", label: "Rotate all 90° counter-clockwise" },
        ],
      },
    ],
  },
  verb: "Organize",
  noun: "a PDF",
  actionLabel: "Organize PDF",
  desc: "Reorder, rotate, and delete pages from your PDF.",
  fileLimit: "up to 20 PDFs per job",
  includeWithoutWatermark: true,
  keywordsBase: "organize pdf",
  intro: [
    "A PDF with pages in the wrong order, a sideways scan, or a few pages that shouldn't be there at all — organizing it by hand in a PDF editor is tedious. This tool fixes page order, rotation, and keeps/removes in one pass.",
    "Choose which pages to keep (by range or list), rotate everything at 90°, 180°, or 270°, and download a correctly ordered file. Clean output, no watermark, and uploads auto-delete within 12 hours.",
  ],
  benefits: [
    { title: "Reorder by range", body: "Keep only the pages you need by entering ranges like 1-4, 6, 8." },
    { title: "Fix sideways scans", body: "Rotate all pages at once to correct scans and photos taken the wrong way." },
    { title: "Remove unwanted pages", body: "Drop blank, duplicate, or stray pages by simply not including them." },
    { title: "Clean output", body: "No watermark is added to your organized file." },
  ],
  steps: [
    { title: "Upload your PDF", body: "Select the PDF you need to organize and upload it." },
    { title: "Choose pages and rotation", body: "Enter the pages to keep and, if needed, pick a rotation for the whole document." },
    { title: "Organize and download", body: "Run the tool and download the corrected PDF." },
  ],
  faq: [
    { q: "Can I remove pages from a PDF?", a: "Yes. Enter only the pages you want to keep — everything else is dropped." },
    { q: "Can I rotate a PDF?", a: "Yes. Rotate all pages 90°, 180°, or 270° in one click." },
    { q: "Does organizing change my original?", a: "No. Your original is never modified — organizing creates new output." },
  ],
};

const tool = makeTool(seed);

export const organizePdfTool: ProgrammaticTool = {
  ...tool,
  variants: [
    ...tool.variants,
    // ── Audience variants ────────────────────────────────────────────────
    {
      slug: "for-students",
      label: "For Students",
      h1: "Organize PDF for Students",
      metaTitle: "Organize PDF for Students — Fix Page Order Before Submitting",
      metaDescription:
        "Organize PDFs for students: reorder pages, remove blanks, and rotate sideways scans before submission. Free, no watermark, no signup. Files auto-delete in 12 hours.",
      heroDescription:
        "Organize PDFs for students — fix page order, remove blank scan pages, and rotate sideways photos before you submit. Free and clean output.",
      icon: ListOrdered,
      intro: [
        "Scanned pages come out sideways. Photos get inserted in the wrong order. Blank pages appear from nowhere. Before any submission, your PDF needs a quick cleanup — and this tool does it in one pass.",
        "Keep only the pages you want, rotate sideways scans upright, and remove blanks. Download a correctly ordered file ready for your portal or printer.",
      ],
      benefits: [
        { title: "Fix page order", body: "Keep only the pages you need and drop the rest before submitting." },
        { title: "Rotate sideways scans", body: "Upright camera shots and scans with one click — no more sideways submissions." },
        { title: "Remove blank pages", body: "Drop the blank pages your scanner added so the file looks clean." },
        { title: "Free before deadlines", body: "No signup or watermark, so you can clean up files in seconds." },
      ],
      steps: [
        { title: "Upload your PDF", body: "Select the scan or document you need to tidy before submission." },
        { title: "Choose pages and rotation", body: "Enter the pages to keep and rotate the file if pages are sideways." },
        { title: "Organize and submit", body: "Download the cleaned file and submit or print it." },
      ],
      faq: [
        { q: "Can I fix a sideways scanned assignment?", a: "Yes. Rotate the whole file 90° or 270° to correct scans taken the wrong way." },
        { q: "Can I remove blank pages from a scan?", a: "Yes. Enter only the pages you want to keep — blanks are dropped automatically." },
        { q: "Will my organized file have a watermark?", a: "No. Output is clean and submission-ready." },
      ],
      keywords: ["organize pdf for students", "reorder pages pdf student", "rotate scanned pdf", "remove blank pages before submission"],
      related: ["for-teachers", "free", "without-watermark"],
    },
    {
      slug: "for-teachers",
      label: "For Teachers",
      h1: "Organize PDF for Teachers",
      metaTitle: "Organize PDF for Teachers — Fix Scans & Reorder Worksheets",
      metaDescription:
        "Organize PDFs for teachers: rotate sideways scans, remove blanks, and reorder pages before printing. Free, no watermark, no signup. Files auto-delete in 12 hours.",
      heroDescription:
        "Organize PDFs for teachers — fix sideways scans, remove blank pages, and reorder worksheets before you print or upload.",
      icon: ListOrdered,
      intro: [
        "Between the school scanner, teacher-share drives, and camera-captured pages, classroom PDFs come in every orientation and order. This tool puts the pages right before they reach the copier or LMS.",
        "Rotate sideways pages upright, remove blanks, and keep only the pages you want — then print or upload a clean, correctly ordered file.",
      ],
      benefits: [
        { title: "Fix sideways scans", body: "Correct scanner output with one-click rotation before printing." },
        { title: "Remove blank pages", body: "Drop the blank pages that inflate worksheets and exam papers." },
        { title: "Keep only what you need", body: "Enter the pages you want and leave the rest out of the final file." },
        { title: "Print-ready output", body: "Clean, correctly ordered pages that are photocopier-ready." },
      ],
      steps: [
        { title: "Upload the PDF", body: "Select the scan or worksheet you need to fix." },
        { title: "Set pages and rotation", body: "Enter the pages to keep and rotate the file if pages are sideways." },
        { title: "Organize and print", body: "Download the corrected file and print or upload it." },
      ],
      faq: [
        { q: "Can I fix a whole packet of sideways scans?", a: "Yes. Rotate all pages at once, then print a correct packet." },
        { q: "Can I remove blank pages from a worksheet scan?", a: "Yes. Keep only the pages you want and blanks are dropped." },
        { q: "Will the organized file print cleanly?", a: "Yes. No watermark or branding is added." },
      ],
      keywords: ["organize pdf for teachers", "rotate scanned worksheets pdf", "reorder pdf pages teacher", "remove blank pages pdf"],
      related: ["for-students", "free", "online"],
    },
  ],
};
