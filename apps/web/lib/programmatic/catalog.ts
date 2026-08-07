import type { LucideIcon } from "lucide-react";
import {
  Globe,
  Gift,
  DropletOff,
  GraduationCap,
  Presentation,
  Scale,
  Smartphone,
  Monitor,
  Apple,
} from "lucide-react";
import type { ToolConfig } from "@/components/tools/PdfToolWidget";

// ── Types ────────────────────────────────────────────────────────────────────

export interface ProgrammaticVariant {
  slug: string;
  label: string; // short label used in nav/anchor
  h1: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  icon: LucideIcon;
  // Unique content sections — each must add genuine value, not just keywords.
  intro: string[];
  benefits: { title: string; body: string }[];
  steps: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  keywords: string[];
  // Related variants to cross-link (slugs within the same tool).
  related: string[];
}

export interface ProgrammaticTool {
  slug: string;
  label: string;
  canonicalPath: string; // e.g. "/merge-pdf"
  toolConfig: ToolConfig;
  variants: ProgrammaticVariant[];
}

// ── Merge PDF variants ───────────────────────────────────────────────────────

const MERGE_CONFIG: ToolConfig = {
  toolType: "merge",
  label: "Merge PDFs",
  accept: ".pdf,application/pdf",
  multiple: true,
  maxFiles: 20,
};

const mergeVariants: ProgrammaticVariant[] = [
  {
    slug: "online",
    label: "Online",
    h1: "Merge PDF Online",
    metaTitle: "Merge PDF Online — Free, No Signup",
    metaDescription:
      "Merge multiple PDFs online in seconds. Drag and drop files, combine them instantly, and download the result. No signup, no install, files auto-deleted after 12 hours.",
    heroDescription:
      "Combine multiple PDF files into one document right in your browser. Everything runs through a secure, encrypted pipeline — no desktop app, no uploads to a third-party server beyond ours, and no account required.",
    icon: Globe,
    intro: [
      "Merging PDFs online is the fastest way to combine scanned contracts, exported documents, or separate chapter files into a single, shareable file. Unlike desktop tools that need an install, an online merger works from any device with a browser and keeps your workflow moving.",
      "Our online merger accepts up to 20 PDF files at once, lets you drop them in any order, and produces a clean combined document in seconds. Because files are processed and auto-deleted within 12 hours, you don't have to worry about copies lingering on our servers.",
    ],
    benefits: [
      {
        title: "No installation",
        body: "Works entirely in your browser. Nothing to download, update, or configure on your computer or phone.",
      },
      {
        title: "Order it your way",
        body: "Drag files into the exact order you need before merging — no rearranging after the fact.",
      },
      {
        title: "Handles many files",
        body: "Combine up to 20 PDFs in a single batch, from quick two-page merges to larger document packs.",
      },
      {
        title: "Private by default",
        body: "Files are transferred over an encrypted connection and automatically deleted within 12 hours.",
      },
    ],
    steps: [
      {
        title: "Upload your PDFs",
        body: "Click the upload area or drag up to 20 PDF files into the window. The order shown is the order they'll appear in the merged file.",
      },
      {
        title: "Reorder if needed",
        body: "Drag any file to reposition it. Make sure the most important pages come first before you combine.",
      },
      {
        title: "Merge and download",
        body: "Click Merge PDFs, wait a few seconds for processing, then download the combined file to your device.",
      },
    ],
    faq: [
      {
        q: "Is merging PDFs online safe?",
        a: "Yes. Files are uploaded over an encrypted connection and automatically deleted from our servers within 12 hours. No one else can access your documents.",
      },
      {
        q: "Do I need to create an account?",
        a: "No. The online merger works without registration. Upload, merge, and download — that's it.",
      },
      {
        q: "What is the maximum number of files I can merge?",
        a: "You can merge up to 20 PDF files in a single job, each reasonably sized for browser upload.",
      },
    ],
    keywords: ["merge pdf online", "combine pdf online", "join pdf files online", "pdf merger online free"],
    related: ["free", "without-watermark", "for-windows"],
  },
  {
    slug: "free",
    label: "Free",
    h1: "Merge PDF Online Free",
    metaTitle: "Merge PDF Online Free — No Cost, No Limits",
    metaDescription:
      "Merge PDFs online for free. Combine unlimited files into one document with no watermarks, no hidden fees, and no signup. Secure, fast, and files auto-deleted in 12 hours.",
    heroDescription:
      "Merge PDFs online for free — genuinely free. No credit card, no trial countdown, no watermark stamped on your output. Upload up to 20 PDFs, combine them, and download the merged file without paying a cent.",
    icon: Gift,
    intro: [
      "Most 'free' PDF mergers aren't really free — they cap the file size, count your merges, or tattoo a watermark on the result. Our free merger has none of those limits: combine up to 20 files, as often as you like, with clean output every time.",
      "The tool is funded entirely by optional premium plans that unlock larger limits for heavy users. For everyday merging — school assignments, work documents, personal archives — the free tier is all you need.",
    ],
    benefits: [
      {
        title: "Truly free",
        body: "No credit card, no free-trial clock, no hidden charges. Merge as many documents as you need.",
      },
      {
        title: "No watermarks",
        body: "Your merged output is clean. We never stamp a brand or promotional watermark onto your files.",
      },
      {
        title: "No file-size tricks",
        body: "Works with real-world documents, not just tiny test files. Combine substantial PDFs in one go.",
      },
      {
        title: "No account walls",
        body: "Free merging without registration. Upload, merge, download, and close the tab.",
      },
    ],
    steps: [
      {
        title: "Add your files",
        body: "Drag up to 20 PDFs into the upload area or browse your device to select them.",
      },
      {
        title: "Arrange the order",
        body: "Drag and drop files into the sequence you want. The first file will be the first pages of the output.",
      },
      {
        title: "Download the result",
        body: "Hit Merge PDFs and grab your combined document the moment processing finishes.",
      },
    ],
    faq: [
      {
        q: "Is the free merge really unlimited?",
        a: "Free merging lets you combine up to 20 files per job with no watermark and no daily quota. Heavy professional use may be served better by a premium plan, but everyday needs are fully covered for free.",
      },
      {
        q: "Will you watermark my merged PDF?",
        a: "No. Your output is clean and ready to share or submit, with no branding added.",
      },
      {
        q: "Why is it free?",
        a: "The free tool is supported by optional premium plans for users who need larger uploads and priority processing. Regular merging costs nothing.",
      },
    ],
    keywords: ["merge pdf free", "combine pdf free online", "free pdf merger no watermark", "join pdf free"],
    related: ["without-watermark", "online", "for-students"],
  },
  {
    slug: "without-watermark",
    label: "Without Watermark",
    h1: "Merge PDF Free Without Watermark",
    metaTitle: "Merge PDF Without Watermark — Clean Output Guaranteed",
    metaDescription:
      "Merge PDFs without watermarks. Combine multiple files into one clean document ready to submit or share. Free, secure, no signup, files auto-deleted in 12 hours.",
    heroDescription:
      "Merge PDFs without watermark, every single time. Your combined document comes out exactly as clean as the files you put in — no logo stamped in the corner, no promotional footer. Just a seamless, professional result.",
    icon: DropletOff,
    intro: [
      "A watermark ruins an otherwise good merged document. It looks unprofessional in a job application, an academic submission, or a client deliverable — and it's the #1 reason people search for a PDF merger without watermark.",
      "PDFThings merges files into a single clean document and never adds a brand mark, footer, or overlay to your output. Combine contracts, assignments, or report bundles and hand over something you'd be proud to put your own name on.",
    ],
    benefits: [
      {
        title: "100% clean output",
        body: "No watermark, logo, or promotional text is ever added to your merged PDF.",
      },
      {
        title: "Professional results",
        body: "The merged file looks exactly like your originals — just combined. Perfect for submissions and clients.",
      },
      {
        title: "No subscriptions",
        body: "Watermark-free merging is included for free. You never pay just to remove a watermark.",
      },
      {
        title: "Your files, deleted",
        body: "Uploads are processed and automatically deleted within 12 hours, keeping your documents private.",
      },
    ],
    steps: [
      {
        title: "Select your PDFs",
        body: "Upload up to 20 PDF files that you want combined into one clean document.",
      },
      {
        title: "Check the order",
        body: "Reorder the files so the pages flow correctly — the merge preserves your arrangement exactly.",
      },
      {
        title: "Download clean output",
        body: "Merge and download. The result is watermark-free and ready to submit or share.",
      },
    ],
    faq: [
      {
        q: "Does your free plan watermark merged files?",
        a: "No. All merges, free or premium, produce watermark-free output. We never add branding to your documents.",
      },
      {
        q: "Will the merged file match my originals?",
        a: "Yes. Page order, quality, and content are preserved. We only combine the files — we don't alter or compress their contents.",
      },
      {
        q: "Can I merge PDFs without creating an account?",
        a: "Absolutely. Use the merger without signing up, and download your clean result immediately.",
      },
    ],
    keywords: ["merge pdf without watermark", "merge pdf no watermark", "combine pdf without watermark free", "pdf merger clean output"],
    related: ["free", "online", "for-lawyers"],
  },
  {
    slug: "for-students",
    label: "For Students",
    h1: "Merge PDF for Students",
    metaTitle: "Merge PDF for Students — Assignments, Notes & Dissertations",
    metaDescription:
      "Merge PDFs for students: combine assignment parts, lecture notes, project reports, and dissertation chapters into one clean file for submission. Free, no watermark, no signup. Files auto-delete in 12 hours.",
    heroDescription:
      "Merge PDFs for students — turn separate assignment parts into one submission-ready file, combine lecture notes and slides into a single study guide, or merge dissertation chapters into one complete document. Free, no watermark, and files auto-delete in 12 hours.",
    icon: GraduationCap,
    intro: [
      "Student life is full of PDFs scattered across portals and folders: a cover page from your course portal, lecture slides from the library site, a scanned reading, and the body of an assignment you wrote last night. Most submission portals — Turnitin, Moodle, Blackboard, Google Classroom, university email systems — accept only a single file. That's exactly what this merger is for.",
      "Merge assignment parts, combine lecture notes and slides into one exam-prep study guide, bundle project report appendices, or join the chapters of a dissertation into a single submission-ready document. You can combine up to 20 PDFs per job, arrange them in the exact order your tutor expects, and download a clean, watermark-free file with no account and no watermark.",
    ],
    benefits: [
      {
        title: "One-file assignment submissions",
        body: "Combine your cover page, body, references, and appendix into a single PDF that Turnitin, Moodle, and Blackboard accept in one upload.",
      },
      {
        title: "Combine lecture notes & slides",
        body: "Merge slides from different lectures and your own notes into one searchable study document for exam revision.",
      },
      {
        title: "Assemble project reports",
        body: "Bundle report sections, data tables, and appendices into one document your supervisor can read top to bottom.",
      },
      {
        title: "Join dissertation chapters",
        body: "Merge chapters, lists of figures, and references into a single file before printing or final submission.",
      },
      {
        title: "Works on any device",
        body: "Use it on a laptop, phone, or library desktop — no install means no IT permissions needed.",
      },
      {
        title: "Deadline friendly",
        body: "No signup and no watermark means no wasted time at 11pm before a midnight deadline.",
      },
    ],
    steps: [
      {
        title: "Collect your document parts",
        body: "Gather the cover page, assignment body, references, and any appendices or scanned figures into one place.",
      },
      {
        title: "Order them for your tutor",
        body: "Drag the files so the cover page comes first, followed by the body and references — exactly how your university expects the file structured.",
      },
      {
        title: "Merge and submit",
        body: "Merge the files, download the combined PDF, and submit it directly to Turnitin, Moodle, Blackboard, or email it to your lecturer.",
      },
    ],
    faq: [
      {
        q: "Is this merger really free for students?",
        a: "Yes. Students can merge up to 20 PDFs per job at no cost, with no watermark and no account — perfect for assignments, lecture notes, and dissertation chapters.",
      },
      {
        q: "Will my professors see a watermark?",
        a: "No. The merged file is completely clean, so it's safe to submit through Turnitin, Moodle, and academic portals.",
      },
      {
        q: "Can I merge my dissertation chapters into one file?",
        a: "Yes. Add each chapter as a separate PDF, arrange them in order, and merge them into a single document before printing or submission.",
      },
      {
        q: "Can I merge scanned pages of handwritten notes?",
        a: "Yes. Scanned PDFs merge exactly like digital files, so you can combine photos or scans of handwritten notes with typed documents.",
      },
    ],
    keywords: ["merge pdf for students", "merge pdf assignment", "combine lecture notes pdf", "merge dissertation chapters", "merge project report pdf"],
    related: ["for-teachers", "free", "without-watermark"],
  },
  {
    slug: "for-teachers",
    label: "For Teachers",
    h1: "Merge PDF for Teachers",
    metaTitle: "Merge PDF for Teachers — Lesson Plans, Worksheets & Exam Papers",
    metaDescription:
      "Merge PDFs for teachers: combine lesson plans, worksheets, exam papers, and grading packets into one printable file. Free, no watermark, no signup. Files auto-delete in 12 hours.",
    heroDescription:
      "Merge PDFs for teachers — turn separate worksheets into one printable packet, combine a lesson plan with its handouts, bundle exam papers with answer keys, or assemble a full grading packet. Free, clean output, ready for the copier.",
    icon: Presentation,
    intro: [
      "Teachers juggle dozens of PDFs every week: worksheet files shared by colleagues, lesson plans drafted in one program, exam papers exported from the exam-bank portal, scanned answer sheets, and admin forms. Printing a 12-file packet page by page — or uploading 12 separate files to your LMS — wastes valuable time.",
      "This merger combines up to 20 PDFs into one clean, collated document. Build a printable worksheet packet for the photocopier, attach answer keys for easy marking, merge exam papers with marking schemes, or assemble a grading packet that stays in the right order. No watermark means copies stay professional for parents and students, and auto-deletion keeps student work off our servers.",
    ],
    benefits: [
      {
        title: "Build printable worksheets & packets",
        body: "Merge separate worksheets into one collated packet ready for the photocopier or your LMS.",
      },
      {
        title: "Combine lesson plans with handouts",
        body: "Attach a lesson plan to its slides, activity sheets, and reading extracts in one shareable file.",
      },
      {
        title: "Merge exam papers & mark schemes",
        body: "Combine a question paper with its mark scheme, or bundle a mock exam set with its answer key.",
      },
      {
        title: "Assemble grading packets",
        body: "Merge answer sheets, rubrics, and feedback forms into a single packet for marking a class set.",
      },
      {
        title: "Bundle weekly materials",
        body: "Merge a week's worth of handouts into one shareable PDF for students and parents.",
      },
      {
        title: "School-computer friendly",
        body: "Browser-based, so it works on locked-down school machines without admin rights.",
      },
    ],
    steps: [
      {
        title: "Collect the files for your packet",
        body: "Gather the worksheets, lesson-plan pages, exam papers, answer keys, or grading forms that belong in the same document.",
      },
      {
        title: "Arrange for the copier or LMS",
        body: "Order the files the way you want them printed or uploaded, with the answer key or mark scheme last if you're keeping it separate.",
      },
      {
        title: "Merge and distribute",
        body: "Download the combined PDF and share it via Google Classroom, your LMS, email, or the photocopier.",
      },
    ],
    faq: [
      {
        q: "Can I merge scanned worksheets and exam papers?",
        a: "Yes. Scanned PDFs merge exactly like digital ones — combine printouts, scans, and digital files into one packet.",
      },
      {
        q: "Is there a cost to combine handouts for a whole class?",
        a: "No. Merging is free, and you can merge up to 20 files per job with no watermark.",
      },
      {
        q: "Can I keep the answer key separate from student worksheets?",
        a: "Yes. Merge the student pages first and download that file, then merge the worksheet with the answer key as a second file for your own marking.",
      },
      {
        q: "Are student files kept on your servers?",
        a: "No. Files are automatically deleted within 12 hours, so student work doesn't linger online.",
      },
    ],
    keywords: ["merge pdf for teachers", "merge worksheets into packet", "combine lesson plan pdf", "merge exam papers pdf", "merge answer key pdf"],
    related: ["for-students", "free", "online"],
  },
  {
    slug: "for-lawyers",
    label: "For Lawyers",
    h1: "Merge PDF for Lawyers",
    metaTitle: "Merge PDF for Lawyers — Contracts, Affidavits & Exhibits",
    metaDescription:
      "Merge PDFs for legal professionals: combine contracts, affidavits, case files, exhibits, and court submissions into one clean bundle. Encrypted, auto-deleted in 12 hours, no watermark.",
    heroDescription:
      "Merge PDFs for lawyers, paralegals, and legal teams — combine contracts with their amendments, bundle affidavits and case files, assemble exhibits into a numbered filing set, or prepare court submissions as a single document. Files are encrypted and auto-deleted within 12 hours.",
    icon: Scale,
    intro: [
      "Legal work is document-heavy, and few tasks are as repetitive as assembling a single PDF from dozens of parts. A contract needs its amendments and schedules attached; an affidavit must sit with its supporting exhibits; a case file bundles correspondence, pleadings, and evidence; and court submissions often require multiple attachments delivered as one document.",
      "This merger assembles up to 20 files into one clean, correctly-ordered PDF in seconds. Order exhibits the way your index requires, attach schedules to contracts, or bundle a complete case file for disclosure. Because confidentiality is non-negotiable, transfers are encrypted and all files are automatically deleted within 12 hours. No watermark is added, so the output is court- and client-ready.",
    ],
    benefits: [
      {
        title: "Assemble contracts with schedules",
        body: "Merge a contract with its amendments, schedules, and annexures into a single execution-ready document.",
      },
      {
        title: "Bundle affidavits & exhibits",
        body: "Combine an affidavit with its supporting exhibits and attachments in the order your index requires.",
      },
      {
        title: "Organize case files",
        body: "Merge pleadings, correspondence, evidence, and research memos into one chronological case bundle.",
      },
      {
        title: "Prepare court submissions",
        body: "Assemble submissions, authorities, and exhibits into one filing-ready PDF for e-filing or print.",
      },
      {
        title: "Privacy you can rely on",
        body: "Encrypted transfers and automatic deletion within 12 hours keep sensitive documents off our servers.",
      },
      {
        title: "Works on the go",
        body: "Merge from a laptop or phone in the office, at court, or while meeting a client.",
      },
    ],
    steps: [
      {
        title: "Prepare your document set",
        body: "Gather the contracts, amendments, affidavits, exhibits, or case-file documents in the order they should appear in the bundle.",
      },
      {
        title: "Match your exhibit or bundle index",
        body: "Drag files so the sequence matches your exhibit index, annexure numbering, or filing list exactly.",
      },
      {
        title: "Merge and save securely",
        body: "Merge the set, download the combined PDF, and file or share it. Your uploads are deleted within 12 hours.",
      },
    ],
    faq: [
      {
        q: "Is it appropriate to use an online tool for legal documents?",
        a: "The tool encrypts all transfers and deletes files automatically within 12 hours. For confidential matters, follow your firm's document-handling policy — the merger leaves no persistent copies on our servers.",
      },
      {
        q: "Can I merge contracts with their schedules and annexures?",
        a: "Yes. Add the contract and each schedule or annexure as a separate PDF, order them correctly, and merge them into one execution-ready document.",
      },
      {
        q: "Can I assemble a large exhibit set for filing?",
        a: "Yes. Combine up to 20 PDFs in one job and reorder them precisely to match your exhibit index before merging.",
      },
      {
        q: "Will the merged document have a watermark?",
        a: "No. Output is clean and free of branding, suitable for professional and court use.",
      },
    ],
    keywords: ["merge pdf for lawyers", "combine contracts pdf", "merge exhibits pdf", "assemble affidavits pdf", "bundle legal documents pdf"],
    related: ["without-watermark", "online", "for-windows"],
  },
  {
    slug: "for-android",
    label: "For Android",
    h1: "Merge PDF on Android",
    metaTitle: "Merge PDF on Android — Combine Files From Your Phone",
    metaDescription:
      "Merge PDFs on your Android phone in the browser. Combine files from downloads, Drive, or email attachments into one document. Free, no app install, files auto-deleted in 12 hours.",
    heroDescription:
      "Merge PDFs on your Android phone or tablet without installing an app. Pick files from downloads, your files app, or email attachments, combine them in any order, and share the merged PDF straight from the browser.",
    icon: Smartphone,
    intro: [
      "When a PDF merge request lands while you're on your phone — a client's attachments, a scanned agreement, a screenshot to include — installing a bulky app is the last thing you want. Our browser-based merger works on any Android device with no install at all.",
      "Upload files from your device's storage or recent downloads, arrange them with simple drag-and-drop, and share the result to email, WhatsApp, Drive, or anywhere else. Your files are processed securely and deleted within 12 hours.",
    ],
    benefits: [
      {
        title: "No app install",
        body: "Works in any mobile browser, so you never need to install (or update) a dedicated app.",
      },
      {
        title: "Merge from anywhere",
        body: "Combine files from downloads, your files app, or email attachments in a single session.",
      },
      {
        title: "Share instantly",
        body: "Download the merged file and share it straight from your phone to email, Drive, or messaging apps.",
      },
      {
        title: "Low data usage",
        body: "Simple, lightweight pages keep mobile data use to a minimum while merging.",
      },
    ],
    steps: [
      {
        title: "Open the merger on your phone",
        body: "Open this page in Chrome or any Android browser. No app download required.",
      },
      {
        title: "Select files from your phone",
        body: "Browse your downloads, files app, or recent documents and select the PDFs to combine.",
      },
      {
        title: "Merge and share",
        body: "Combine the files, then use your phone's share sheet to send the merged PDF anywhere.",
      },
    ],
    faq: [
      {
        q: "Does this need the Google Play Store app?",
        a: "No app exists — and none is needed. The merger runs entirely in your Android browser.",
      },
      {
        q: "Can I merge PDFs from my email attachments on Android?",
        a: "Yes. Save the attachments to your device first, or open them in your files app, then upload them to the merger.",
      },
      {
        q: "Is mobile merging free?",
        a: "Yes. The same free limits apply on mobile as on desktop — up to 20 files, no watermark.",
      },
    ],
    keywords: ["merge pdf on android", "merge pdf android phone", "combine pdf mobile", "pdf merger for android"],
    related: ["for-windows", "for-mac", "online"],
  },
  {
    slug: "for-windows",
    label: "For Windows",
    h1: "Merge PDF on Windows",
    metaTitle: "Merge PDF on Windows — Combine Files, No Install",
    metaDescription:
      "Merge PDFs on Windows in your browser — no program to install. Combine files from any folder into one clean document. Free, no watermark, files auto-deleted in 12 hours.",
    heroDescription:
      "Merge PDFs on Windows without installing anything. Open the tool in your browser, drag files from any folder, and combine them into one clean document. Works on Windows 10 and Windows 11.",
    icon: Monitor,
    intro: [
      "Windows users usually reach for a PDF program — but the built-in options are limited, and installing dedicated software just to merge two files is overkill. Our browser-based merger works on any Windows PC, including work machines where you can't install software.",
      "Drag files straight from File Explorer into the upload area, reorder them with a click, and download the combined document. Nothing is installed, and your files are deleted from our servers within 12 hours.",
    ],
    benefits: [
      {
        title: "No Windows install",
        body: "Works in Edge, Chrome, or Firefox — no program to download, install, or keep updated.",
      },
      {
        title: "Drag from File Explorer",
        body: "Drag PDFs straight from any Explorer folder directly into the merge window.",
      },
      {
        title: "Works on locked-down PCs",
        body: "Browser-based means it runs on work and school machines where installing apps is blocked.",
      },
      {
        title: "Clean output",
        body: "No watermark added to your merged file — ready for sharing or printing.",
      },
    ],
    steps: [
      {
        title: "Open the merger in your browser",
        body: "Use Edge, Chrome, or Firefox on any Windows 10 or Windows 11 PC.",
      },
      {
        title: "Drag files from Explorer",
        body: "Drag PDFs from any folder into the upload area, or click to browse. Reorder them as needed.",
      },
      {
        title: "Merge and save",
        body: "Combine the files and download the merged PDF to your desired folder.",
      },
    ],
    faq: [
      {
        q: "Do I need any PDF software on Windows?",
        a: "No. The merger runs in your browser, so there's nothing to install alongside it.",
      },
      {
        q: "Does it work on Windows 11?",
        a: "Yes. The tool works in any modern browser on Windows 10 and Windows 11.",
      },
      {
        q: "Can I drag and drop from File Explorer?",
        a: "Yes. Drag PDFs from any Explorer folder directly into the upload area and they'll be added automatically.",
      },
    ],
    keywords: ["merge pdf on windows", "merge pdf windows 11", "combine pdf files windows", "pdf merger no install windows"],
    related: ["for-mac", "for-android", "online"],
  },
  {
    slug: "for-mac",
    label: "For Mac",
    h1: "Merge PDF on Mac",
    metaTitle: "Merge PDF on Mac — Combine Files in Safari or Chrome",
    metaDescription:
      "Merge PDFs on your Mac in Safari or Chrome. Combine files from Finder into one clean document, no app needed. Free, no watermark, files auto-deleted in 12 hours.",
    heroDescription:
      "Merge PDFs on your Mac directly in the browser. Drag files from Finder, combine them in the order you choose, and download a clean merged PDF. Works in Safari, Chrome, and Firefox on macOS.",
    icon: Apple,
    intro: [
      "Preview on macOS can reorder pages in a PDF, but merging multiple separate files is clunky and easy to get wrong. For a quick, reliable merge, a browser-based tool is simpler — especially on machines where you'd rather not install extra software.",
      "Drag PDFs straight from Finder into the merge window, arrange them as needed, and download the combined document in seconds. Works seamlessly in Safari, Chrome, and Firefox on any recent version of macOS.",
    ],
    benefits: [
      {
        title: "Drag from Finder",
        body: "Drag PDFs from any Finder window directly into the upload area — no file menus to navigate.",
      },
      {
        title: "Works in Safari",
        body: "Safari is fully supported, along with Chrome and Firefox on macOS.",
      },
      {
        title: "Faster than Preview",
        body: "Merging separate files is one click instead of Preview's multi-step page reordering.",
      },
      {
        title: "Clean output",
        body: "No watermark or branding on the merged document — ready to share or print.",
      },
    ],
    steps: [
      {
        title: "Open the merger in your browser",
        body: "Use Safari, Chrome, or Firefox on your Mac. No application install required.",
      },
      {
        title: "Drag files from Finder",
        body: "Drag the PDFs you want to combine from any Finder window into the upload area.",
      },
      {
        title: "Merge and download",
        body: "Combine the files and download the merged PDF to your Documents folder.",
      },
    ],
    faq: [
      {
        q: "Does this replace Preview for merging PDFs?",
        a: "For combining multiple separate files, this tool is simpler and faster than Preview's page-merge workflow. Preview remains fine for editing a single document.",
      },
      {
        q: "Does it work on Apple Silicon Macs?",
        a: "Yes. The tool is browser-based, so it works identically on Intel and Apple Silicon Macs.",
      },
      {
        q: "Can I drag files from Finder on macOS?",
        a: "Yes. Drag PDFs from any Finder window straight into the upload area and they're added automatically.",
      },
    ],
    keywords: ["merge pdf on mac", "merge pdf mac preview", "combine pdf files mac", "pdf merger for mac"],
    related: ["for-windows", "for-android", "online"],
  },
];

// ── Tool registry ─────────────────────────────────────────────────────────────
// Extend this array with other tools (split, compress, …) to expand the
// programmatic library later. Each tool needs its own unique variants.

export const PROGRAMMATIC_TOOLS: ProgrammaticTool[] = [
  {
    slug: "merge-pdf",
    label: "Merge PDF",
    canonicalPath: "/merge-pdf",
    toolConfig: MERGE_CONFIG,
    variants: mergeVariants,
  },
];

// ── Lookup helpers ────────────────────────────────────────────────────────────

export function getTool(slug: string): ProgrammaticTool | undefined {
  return PROGRAMMATIC_TOOLS.find((t) => t.slug === slug);
}

export function getToolVariantSlugs(slug: string): string[] {
  const tool = getTool(slug);
  return tool ? tool.variants.map((v) => v.slug) : [];
}

export function getVariant(
  toolSlug: string,
  variantSlug: string,
): { tool: ProgrammaticTool; variant: ProgrammaticVariant } | null {
  const tool = getTool(toolSlug);
  if (!tool) return null;
  const variant = tool.variants.find((v) => v.slug === variantSlug);
  if (!variant) return null;
  return { tool, variant };
}

export function getAllProgrammaticRoutes(): { tool: string; variant: string }[] {
  return PROGRAMMATIC_TOOLS.flatMap((tool) =>
    tool.variants.map((v) => ({ tool: tool.slug, variant: v.slug })),
  );
}
