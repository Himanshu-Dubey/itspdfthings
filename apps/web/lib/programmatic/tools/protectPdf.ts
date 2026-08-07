import { Lock } from "lucide-react";
import { makeTool, type PlatformSeed } from "../platformFactory";
import type { ProgrammaticTool } from "../types";

const seed: PlatformSeed = {
  slug: "protect-pdf",
  label: "Protect PDF",
  canonicalPath: "/protect-pdf",
  toolConfig: {
    toolType: "protect",
    label: "Protect PDF",
    accept: ".pdf,application/pdf",
    fields: [
      {
        name: "action",
        label: "Action",
        type: "select",
        defaultValue: "protect",
        options: [
          { value: "protect", label: "Protect - add password" },
          { value: "unlock", label: "Unlock - remove password" },
        ],
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Password to protect or unlock the PDF",
      },
    ],
  },
  verb: "Protect",
  noun: "a PDF",
  actionLabel: "Protect PDF",
  desc: "Add or remove password protection from PDF files.",
  fileLimit: "up to 20 PDFs per job",
  includeWithoutWatermark: false,
  keywordsBase: "protect pdf with password",
  intro: [
    "A password-protected PDF is the simplest way to control who opens a document. Protect a file before sending it, or unlock a PDF you're authorized to open so it's easier to work with.",
    "This tool adds a password to any PDF, or unlocks a PDF when you have the password. Choose protect to add a password, or unlock to remove one. Uploads are encrypted and auto-delete within 12 hours.",
  ],
  benefits: [
    { title: "Add a password", body: "Protect a PDF so only people with the password can open it." },
    { title: "Unlock PDFs", body: "Remove a password from a file you're authorized to open." },
    { title: "Choose your own password", body: "Set any password you like when protecting a document." },
    { title: "Secure by design", body: "Transfers are encrypted and uploads auto-delete within 12 hours." },
  ],
  steps: [
    { title: "Upload your PDF", body: "Select the PDF you want to protect or unlock." },
    { title: "Choose protect or unlock", body: "Pick protect to add a password, or unlock to remove one (you'll need the password)." },
    { title: "Run and download", body: "Download the protected or unlocked PDF." },
  ],
  faq: [
    { q: "Can I add a password to a PDF?", a: "Yes. Choose protect, enter a password, and only people with it can open the file." },
    { q: "Can I remove a password from a PDF?", a: "Yes. Choose unlock and provide the existing password." },
    { q: "Are my files kept on your servers?", a: "No. Uploads are encrypted and automatically deleted within 12 hours." },
  ],
};

const tool = makeTool(seed);

export const protectPdfTool: ProgrammaticTool = {
  ...tool,
  variants: [
    ...tool.variants,
    // ── Audience variants ────────────────────────────────────────────────
    {
      slug: "for-students",
      label: "For Students",
      h1: "Protect PDF for Students",
      metaTitle: "Protect PDF for Students — Password-Protect Notes & Drafts",
      metaDescription:
        "Protect PDFs for students: password-protect notes, drafts, and documents before sharing or storing. Free, no signup. Files auto-delete in 12 hours.",
      heroDescription:
        "Protect PDFs for students — add a password to notes, drafts, and documents before sharing or storing them, and unlock files you're authorized to open.",
      icon: Lock,
      intro: [
        "Roommates, shared computers, and group email chains all make it easy for your files to end up in the wrong hands. A simple password on a PDF keeps drafts, marks, and personal documents private.",
        "Add a password to any PDF before sharing or storing it, or unlock a file you're authorized to open. Simple, secure, and uploads auto-delete within 12 hours.",
      ],
      benefits: [
        { title: "Protect drafts and marks", body: "Password-protect unfinished work and graded documents." },
        { title: "Share safely", body: "Send password-protected files to tutors or group members with control over access." },
        { title: "Unlock your own files", body: "Remove passwords from files you're authorized to open." },
        { title: "Free and instant", body: "No signup — protect or unlock in seconds." },
      ],
      steps: [
        { title: "Upload your PDF", body: "Select the document to protect or unlock." },
        { title: "Set or enter a password", body: "Choose protect and set a password, or unlock and enter the existing one." },
        { title: "Run and download", body: "Download the protected or unlocked file." },
      ],
      faq: [
        { q: "Can I password-protect my assignment drafts?", a: "Yes. Add a password so only you (and anyone you share it with) can open them." },
        { q: "Can I unlock a PDF I received?", a: "Yes, if you have the password. Choose unlock and enter it." },
        { q: "Are my files kept on your servers?", a: "No. Uploads auto-delete within 12 hours." },
      ],
      keywords: ["protect pdf for students", "password protect notes pdf", "lock pdf student", "unlock pdf with password"],
      related: ["for-teachers", "free", "online"],
    },
    {
      slug: "for-teachers",
      label: "For Teachers",
      h1: "Protect PDF for Teachers",
      metaTitle: "Protect PDF for Teachers — Password-Protect Exam Papers",
      metaDescription:
        "Protect PDFs for teachers: password-protect exam papers and answer keys before sharing. Free, no signup. Files auto-delete in 12 hours.",
      heroDescription:
        "Protect PDFs for teachers — password-protect exam papers, answer keys, and internal materials so only authorized staff can open them.",
      icon: Lock,
      intro: [
        "Exam papers and answer keys need to stay confidential until they're meant to be seen. A password on the PDF is a simple, effective safeguard when sharing with colleagues or storing on shared drives.",
        "Add a password to exam papers, answer keys, and internal resources before distributing or storing. Unlock files when you're authorized to.",
      ],
      benefits: [
        { title: "Protect exam papers", body: "Keep papers confidential with a password until exam day." },
        { title: "Secure answer keys", body: "Protect keys so only authorized staff can open them." },
        { title: "Safe shared storage", body: "Password-protect files stored on school drives or in the cloud." },
        { title: "Simple and secure", body: "Uploads are encrypted and auto-deleted within 12 hours." },
      ],
      steps: [
        { title: "Upload the PDF", body: "Select the exam paper, answer key, or resource to protect." },
        { title: "Set a password", body: "Choose protect and enter a password you'll share only with authorized staff." },
        { title: "Run and distribute", body: "Download the protected file and share the password separately." },
      ],
      faq: [
        { q: "Can I protect an exam paper with a password?", a: "Yes. Protect the paper and share the password only with authorized staff." },
        { q: "Can I unlock a paper when needed?", a: "Yes, if you have the password. Choose unlock and enter it." },
        { q: "Are uploaded exams kept on your servers?", a: "No. Uploads auto-delete within 12 hours." },
      ],
      keywords: ["protect pdf for teachers", "password protect exam papers", "lock answer key pdf", "secure test pdf"],
      related: ["for-students", "free", "online"],
    },
    {
      slug: "for-lawyers",
      label: "For Lawyers",
      h1: "Protect PDF for Lawyers",
      metaTitle: "Protect PDF for Lawyers — Password-Protect Confidential Documents",
      metaDescription:
        "Protect PDFs for legal professionals: password-protect confidential documents and case files. Encrypted, auto-deleted in 12 hours.",
      heroDescription:
        "Protect PDFs for lawyers — add a password to confidential documents, case files, and drafts before sharing or storing. Encrypted and auto-deleted within 12 hours.",
      icon: Lock,
      intro: [
        "Confidentiality is the backbone of legal work. When sharing a draft with opposing counsel, an opinion with a client, or a case file across firms, a password adds a critical layer of control.",
        "Add a password to any document before sharing, or unlock files you're authorized to open. Transfers are encrypted and all uploads auto-delete within 12 hours.",
      ],
      benefits: [
        { title: "Protect confidential docs", body: "Password-protect opinions, drafts, and client materials before sharing." },
        { title: "Control case-file access", body: "Restrict who can open sensitive files with a password." },
        { title: "Secure external sharing", body: "Share files with counsel or clients while controlling access." },
        { title: "Secure by design", body: "Encrypted transfers and automatic deletion within 12 hours." },
      ],
      steps: [
        { title: "Upload the document", body: "Select the confidential document, case file, or draft to protect." },
        { title: "Set a password", body: "Choose protect and enter a password, then share it separately from the file." },
        { title: "Run and distribute", body: "Download the protected file and share the password through a secure channel." },
      ],
      faq: [
        { q: "Can I password-protect confidential legal documents?", a: "Yes. Add a password and share it separately from the file for controlled access." },
        { q: "Is it appropriate to use an online tool for legal documents?", a: "Transfers are encrypted and files auto-delete within 12 hours. For confidential matters, follow your firm's document-handling policy." },
        { q: "Can I unlock a file I'm authorized to open?", a: "Yes. Choose unlock and provide the existing password." },
      ],
      keywords: ["protect pdf for lawyers", "password protect legal documents", "lock confidential pdf", "secure case file pdf"],
      related: ["free", "online", "for-windows"],
    },
  ],
};
