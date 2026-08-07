import {
  Globe,
  Gift,
  DropletOff,
  Smartphone,
  Monitor,
  Apple,
} from "lucide-react";
import type { ProgrammaticVariant, ProgrammaticTool } from "./types";
import type { ToolConfig } from "@/components/tools/PdfToolWidget";

/**
 * Builds the six platform variants (online, free, without-watermark,
 * android, windows, mac) for a tool. Each variant is written with the
 * tool's own verb/noun so the copy stays specific, not mad-libs.
 */

export interface PlatformSeed {
  slug: string;
  label: string;
  canonicalPath: string;
  toolConfig: ToolConfig;
  verb: string; // e.g. "Split"
  noun: string; // e.g. "a PDF"
  actionLabel: string; // e.g. "Split PDF"
  desc: string; // one-line tool description
  fileLimit: string; // e.g. "up to 20 PDFs"
  includeWithoutWatermark: boolean;
  keywordsBase: string;
  // Tool-specific unique content used across platform variants.
  intro: string[];
  benefits: { title: string; body: string }[];
  steps: { title: string; body: string }[];
  faq: { q: string; a: string }[];
}

function titleCase(v: string): string {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

export function buildPlatformVariants(seed: PlatformSeed): ProgrammaticVariant[] {
  const v = seed.verb.toLowerCase();
  const variants: ProgrammaticVariant[] = [];

  const baseOnline = {
    icon: Globe,
    intro: [
      `${seed.verb} ${seed.noun} online in your browser — no desktop app, no install, no account. Open the page, drop in your files, and download the result in seconds. Everything runs through an encrypted connection and your files are auto-deleted within 12 hours.`,
      `The tool accepts ${seed.fileLimit}, lets you ${v} them in the order you choose, and produces clean output every time.`,
    ],
    benefits: seed.benefits,
    steps: seed.steps,
    faq: [
      {
        q: `Is ${v}ing PDFs online safe?`,
        a: `Yes. Files are uploaded over an encrypted connection and automatically deleted from our servers within 12 hours.`,
      },
      {
        q: "Do I need to create an account?",
        a: "No. The tool works without registration — upload, process, and download.",
      },
      {
        q: `How many files can I ${v} at once?`,
        a: `You can ${v} ${seed.fileLimit} in a single job.`,
      },
    ],
  };

  variants.push({
    slug: "online",
    label: "Online",
    h1: `${seed.verb} ${seed.noun} Online`,
    metaTitle: `${seed.verb} ${seed.noun} Online — Free, No Signup`,
    metaDescription: `${seed.verb} ${seed.noun} online in seconds. ${titleCase(seed.desc)} No signup, no install, files auto-deleted after 12 hours.`,
    heroDescription: `${seed.verb} ${seed.noun} online with no install and no account. ${titleCase(seed.desc)} Upload ${seed.fileLimit}, process instantly, and download clean output.`,
    ...baseOnline,
    keywords: [`${v} pdf online`, `${v} pdf online free`, `free online ${v}`, `${v} pdf files online`],
    related: seed.includeWithoutWatermark ? ["free", "without-watermark", "for-windows"] : ["free", "for-windows", "for-android"],
  });

  variants.push({
    slug: "free",
    label: "Free",
    h1: `${seed.verb} ${seed.noun} Free`,
    metaTitle: `${seed.verb} ${seed.noun} Free — No Cost, No Limits`,
    metaDescription: `${seed.verb} ${seed.noun} for free. ${titleCase(seed.desc)} No watermarks, no hidden fees, no signup. Files auto-deleted in 12 hours.`,
    heroDescription: `${seed.verb} ${seed.noun} free — genuinely free. No credit card, no trial countdown, no watermark on your output. ${titleCase(seed.desc)}`,
    icon: Gift,
    intro: [
      `Most “free” PDF tools aren't really free — they cap file sizes, count your jobs, or stamp a watermark on the result. This one has none of those limits: ${v} ${seed.fileLimit}, as often as you like, with clean output every time.`,
      `The tool is funded entirely by optional premium plans for heavy users. For everyday ${v}ing, the free tier is all you need.`,
    ],
    benefits: [
      { title: "Truly free", body: "No credit card, no trial clock, no hidden charges. Process as many documents as you need." },
      { title: "No watermarks", body: "Your output is clean. We never stamp a brand or promotional watermark onto your files." },
      { title: "No file-size tricks", body: "Works with real-world documents, not just tiny test files." },
      { title: "No account walls", body: `Free ${v}ing without registration. Upload, ${v}, download, and close the tab.` },
    ],
    steps: seed.steps,
    faq: [
      { q: `Is the free ${v} really unlimited?`, a: `Free ${v}ing lets you process ${seed.fileLimit} per job with no watermark and no daily quota.` },
      { q: "Will you watermark my output?", a: "No. Your files come out clean, with no branding added." },
      { q: "Why is it free?", a: "The free tool is supported by optional premium plans. Regular use costs nothing." },
    ],
    keywords: [`${v} pdf free`, `${v} pdf free online`, `free pdf ${v} no watermark`, `${v} pdf free`],
    related: seed.includeWithoutWatermark ? ["without-watermark", "online", "for-students"] : ["online", "for-students", "for-android"],
  });

  if (seed.includeWithoutWatermark) {
    variants.push({
      slug: "without-watermark",
      label: "Without Watermark",
      h1: `${seed.verb} ${seed.noun} Without Watermark`,
      metaTitle: `${seed.verb} ${seed.noun} Without Watermark — Clean Output`,
      metaDescription: `${seed.verb} ${seed.noun} without watermarks. ${titleCase(seed.desc)} Free, secure, no signup, files auto-deleted in 12 hours.`,
      heroDescription: `${seed.verb} ${seed.noun} without watermark, every time. Your output comes out exactly as clean as the files you put in — no logo, no footer, just a professional result.`,
      icon: DropletOff,
      intro: [
        `A watermark ruins an otherwise good ${seed.noun.toLowerCase()}. It looks unprofessional in a submission, a client deliverable, or a shared file — and it's the #1 reason people look for a tool without one.`,
        `This tool never adds a brand mark, footer, or overlay to your output. ${titleCase(seed.desc)}`,
      ],
      benefits: [
        { title: "100% clean output", body: "No watermark, logo, or promotional text is ever added to your files." },
        { title: "Professional results", body: "The output looks exactly like your originals — just processed. Perfect for submissions and clients." },
        { title: "No subscriptions", body: `Watermark-free ${v}ing is included for free. You never pay just to remove a watermark.` },
        { title: "Your files, deleted", body: "Uploads are processed and automatically deleted within 12 hours." },
      ],
      steps: seed.steps,
      faq: [
        { q: "Does your free plan watermark files?", a: "No. All jobs, free or premium, produce watermark-free output. We never add branding to your documents." },
        { q: "Will my output match my originals?", a: "Yes. Page order, quality, and content are preserved. We only process — we don't alter your contents." },
        { q: "Can I use this without an account?", a: "Absolutely. No signup needed, and you can download your clean result immediately." },
      ],
      keywords: [`${v} pdf without watermark`, `${v} pdf no watermark`, `${v} pdf without watermark free`, `pdf ${v} clean output`],
      related: ["free", "online", "for-lawyers"],
    });
  }

  variants.push({
    slug: "for-android",
    label: "For Android",
    h1: `${seed.verb} ${seed.noun} on Android`,
    metaTitle: `${seed.verb} ${seed.noun} on Android — From Your Phone`,
    metaDescription: `${seed.verb} ${seed.noun} on your Android phone in the browser. ${titleCase(seed.desc)} No app install, files auto-deleted in 12 hours.`,
    heroDescription: `${seed.verb} ${seed.noun} on your Android phone or tablet without installing an app. Pick files from downloads, your files app, or email attachments, process them, and share the result.`,
    icon: Smartphone,
    intro: [
      `When a ${seed.noun.toLowerCase()} job lands while you're on your phone, installing a bulky app is the last thing you want. This browser-based tool works on any Android device with no install at all.`,
      `Upload files from your device's storage or recent downloads, choose your options, and share the result to email, WhatsApp, Drive, or anywhere else. Files are processed securely and deleted within 12 hours.`,
    ],
    benefits: [
      { title: "No app install", body: "Works in any mobile browser, so you never need to install (or update) a dedicated app." },
      { title: "Work from anywhere", body: "Process files from downloads, your files app, or email attachments in a single session." },
      { title: "Share instantly", body: "Download the result and share it straight from your phone to email, Drive, or messaging apps." },
      { title: "Low data usage", body: "Simple, lightweight pages keep mobile data use to a minimum." },
    ],
    steps: [
      { title: "Open the tool on your phone", body: "Open this page in Chrome or any Android browser. No app download required." },
      { title: "Select files from your phone", body: "Browse your downloads, files app, or recent documents and select the files to process." },
      { title: `Process and share`, body: `Run the ${v} and use your phone's share sheet to send the result anywhere.` },
    ],
    faq: [
      { q: "Does this need a Google Play Store app?", a: "No app exists — and none is needed. The tool runs entirely in your Android browser." },
      { q: "Can I use files from my email attachments on Android?", a: "Yes. Save the attachments to your device first, then upload them to the tool." },
      { q: "Is mobile use free?", a: "Yes. The same free limits apply on mobile as on desktop." },
    ],
    keywords: [`${v} pdf on android`, `${v} pdf android phone`, `${v} pdf mobile`, `pdf ${v} for android`],
    related: ["for-windows", "for-mac", "online"],
  });

  variants.push({
    slug: "for-windows",
    label: "For Windows",
    h1: `${seed.verb} ${seed.noun} on Windows`,
    metaTitle: `${seed.verb} ${seed.noun} on Windows — No Install`,
    metaDescription: `${seed.verb} ${seed.noun} on Windows in your browser — no program to install. ${titleCase(seed.desc)} Free, no watermark, files auto-deleted in 12 hours.`,
    heroDescription: `${seed.verb} ${seed.noun} on Windows without installing anything. Open the tool in your browser, drag files from any folder, and download the result. Works on Windows 10 and Windows 11.`,
    icon: Monitor,
    intro: [
      `Windows users usually reach for a PDF program — but the built-in options are limited, and installing dedicated software for one job is overkill. This browser-based tool works on any Windows PC, including work machines where you can't install software.`,
      `Drag files straight from File Explorer into the upload area, choose your options, and download the result. Nothing is installed, and your files are deleted from our servers within 12 hours.`,
    ],
    benefits: [
      { title: "No Windows install", body: "Works in Edge, Chrome, or Firefox — no program to download, install, or keep updated." },
      { title: "Drag from File Explorer", body: "Drag files straight from any Explorer folder directly into the tool window." },
      { title: "Works on locked-down PCs", body: "Browser-based means it runs on work and school machines where installing apps is blocked." },
      { title: "Clean output", body: "No watermark added — ready for sharing or printing." },
    ],
    steps: [
      { title: "Open the tool in your browser", body: "Use Edge, Chrome, or Firefox on any Windows 10 or Windows 11 PC." },
      { title: "Drag files from Explorer", body: "Drag files from any folder into the upload area, or click to browse." },
      { title: `Process and save`, body: `Run the ${v} and download the result to your chosen folder.` },
    ],
    faq: [
      { q: "Do I need any PDF software on Windows?", a: "No. The tool runs in your browser, so there's nothing to install alongside it." },
      { q: "Does it work on Windows 11?", a: "Yes. The tool works in any modern browser on Windows 10 and Windows 11." },
      { q: "Can I drag and drop from File Explorer?", a: "Yes. Drag files from any Explorer folder directly into the upload area." },
    ],
    keywords: [`${v} pdf on windows`, `${v} pdf windows 11`, `${v} pdf files windows`, `pdf ${v} no install windows`],
    related: ["for-mac", "for-android", "online"],
  });

  variants.push({
    slug: "for-mac",
    label: "For Mac",
    h1: `${seed.verb} ${seed.noun} on Mac`,
    metaTitle: `${seed.verb} ${seed.noun} on Mac — in Safari or Chrome`,
    metaDescription: `${seed.verb} ${seed.noun} on your Mac in Safari or Chrome. ${titleCase(seed.desc)} No app needed. Free, no watermark, files auto-deleted in 12 hours.`,
    heroDescription: `${seed.verb} ${seed.noun} on your Mac directly in the browser. Drag files from Finder, choose your options, and download a clean result. Works in Safari, Chrome, and Firefox on macOS.`,
    icon: Apple,
    intro: [
      `macOS has Preview for editing a single PDF, but ${v}ing multiple files is clunky and easy to get wrong. For a quick, reliable job, a browser-based tool is simpler — especially on machines where you'd rather not install extra software.`,
      `Drag files straight from Finder into the tool window, choose your options, and download the result in seconds. Works seamlessly in Safari, Chrome, and Firefox on any recent version of macOS.`,
    ],
    benefits: [
      { title: "Drag from Finder", body: "Drag files from any Finder window directly into the upload area — no file menus to navigate." },
      { title: "Works in Safari", body: "Safari is fully supported, along with Chrome and Firefox on macOS." },
      { title: "Faster than Preview", body: "Processing multiple files is one click instead of Preview's multi-step workflow." },
      { title: "Clean output", body: "No watermark or branding on the result — ready to share or print." },
    ],
    steps: [
      { title: "Open the tool in your browser", body: "Use Safari, Chrome, or Firefox on your Mac. No application install required." },
      { title: "Drag files from Finder", body: "Drag the files you want to process from any Finder window into the upload area." },
      { title: `Process and download`, body: `Run the ${v} and download the result to your Documents folder.` },
    ],
    faq: [
      { q: "Does this replace Preview for working with PDFs?", a: "For processing multiple files, this tool is simpler and faster than Preview. Preview remains fine for editing a single document." },
      { q: "Does it work on Apple Silicon Macs?", a: "Yes. The tool is browser-based, so it works identically on Intel and Apple Silicon Macs." },
      { q: "Can I drag files from Finder on macOS?", a: "Yes. Drag files from any Finder window straight into the upload area." },
    ],
    keywords: [`${v} pdf on mac`, `${v} pdf mac`, `${v} pdf files mac`, `pdf ${v} for mac`],
    related: ["for-windows", "for-android", "online"],
  });

  return variants;
}

export function makeTool(seed: PlatformSeed): ProgrammaticTool {
  return {
    slug: seed.slug,
    label: seed.label,
    canonicalPath: seed.canonicalPath,
    toolConfig: seed.toolConfig,
    variants: buildPlatformVariants(seed),
  };
}
