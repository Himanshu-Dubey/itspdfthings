import { FileImage } from "lucide-react";
import { makeTool, type PlatformSeed } from "../platformFactory";
import type { ProgrammaticTool } from "../types";

const seed: PlatformSeed = {
  slug: "pdf-to-image",
  label: "PDF to Image",
  canonicalPath: "/pdf-to-image",
  toolConfig: {
    toolType: "pdf-to-image",
    label: "Convert to Images",
    accept: ".pdf,application/pdf",
    fields: [
      {
        name: "format",
        label: "Output format",
        type: "select",
        defaultValue: "jpg",
        options: [
          { value: "jpg", label: "JPG (smaller file size)" },
          { value: "png", label: "PNG (lossless, larger files)" },
        ],
      },
      {
        name: "dpi",
        label: "Resolution (DPI)",
        type: "select",
        defaultValue: "150",
        options: [
          { value: "72", label: "72 DPI (screen / low quality)" },
          { value: "150", label: "150 DPI (recommended)" },
          { value: "300", label: "300 DPI (print quality)" },
        ],
      },
    ],
  },
  verb: "Convert",
  noun: "PDF to JPG",
  actionLabel: "Convert to Images",
  desc: "Export PDF pages as high-quality JPG or PNG images.",
  fileLimit: "PDFs up to 20 pages per job",
  includeWithoutWatermark: true,
  keywordsBase: "pdf to image",
  intro: [
    "Exporting PDF pages as images is essential for sharing on social media, inserting into documents or slides, or building image galleries. This tool converts every page of your PDF into a JPG or PNG at the resolution you choose.",
    "Pick JPG for smaller files or PNG for lossless quality, and choose 72, 150, or 300 DPI depending on whether the images are for screen or print. Clean output, no watermark, and uploads auto-delete within 12 hours.",
  ],
  benefits: [
    { title: "JPG or PNG output", body: "Choose JPG for smaller files or PNG for lossless, print-quality images." },
    { title: "Pick your resolution", body: "72 DPI for screen, 150 DPI for balance, or 300 DPI for print." },
    { title: "Every page exported", body: "Each PDF page becomes its own image file, ready to use." },
    { title: "Clean output", body: "No watermark is added to your exported images." },
  ],
  steps: [
    { title: "Upload your PDF", body: "Select the PDF you want to convert to images." },
    { title: "Choose format and resolution", body: "Pick JPG or PNG, and 72, 150, or 300 DPI." },
    { title: "Convert and download", body: "Convert and download each page as its own image file." },
  ],
  faq: [
    { q: "What's the difference between JPG and PNG output?", a: "JPG gives smaller files with slight compression; PNG is lossless and better for text or graphics." },
    { q: "What DPI should I choose?", a: "150 DPI is best for most uses; choose 300 DPI for print and 72 DPI for quick screen sharing." },
    { q: "Does each page become a separate image?", a: "Yes. Every PDF page is exported as its own JPG or PNG file." },
  ],
};

const tool = makeTool(seed);

export const pdfToImageTool: ProgrammaticTool = {
  ...tool,
  variants: [
    ...tool.variants,
    // ── Audience variants ────────────────────────────────────────────────
    {
      slug: "for-students",
      label: "For Students",
      h1: "PDF to Image for Students",
      metaTitle: "PDF to Image for Students — Export Pages for Slides & Notes",
      metaDescription:
        "Convert PDF pages to images for students: export slides, diagrams, and charts as JPG or PNG for presentations and notes. Free, no watermark, no signup. Files auto-delete in 12 hours.",
      heroDescription:
        "Convert PDF pages to images for students — export slides, diagrams, and charts from your PDFs as JPG or PNG for presentations, notes, and study materials.",
      icon: FileImage,
      intro: [
        "Need a diagram from a PDF in your slides, a chart in your lab report, or a page from a paper in your notes? Exporting PDF pages as images makes that trivial — no screenshot cropping required.",
        "Convert any PDF into JPG or PNG images at your chosen resolution. Use them in presentations, insert them into reports, or share them with classmates.",
      ],
      benefits: [
        { title: "Export for slides", body: "Turn PDF pages into images you can drop straight into PowerPoint or Google Slides." },
        { title: "Insert into reports", body: "Add diagrams, charts, and figures from papers into your own documents." },
        { title: "High-res study images", body: "Export at 150 or 300 DPI for sharp zooming while studying." },
        { title: "Free and instant", body: "No signup or watermark — convert in seconds before a deadline." },
      ],
      steps: [
        { title: "Upload your PDF", body: "Select the paper, slides, or document with the pages you need." },
        { title: "Pick format and resolution", body: "Choose JPG or PNG, and a DPI that matches where you'll use the image." },
        { title: "Convert and use", body: "Download the images and insert them into your slides, notes, or reports." },
      ],
      faq: [
        { q: "Can I get a single diagram as an image?", a: "Yes. Convert the page containing the diagram, then crop the image if needed." },
        { q: "Are exported images good for presentations?", a: "Yes. Export at 150 DPI for a sharp balance of quality and file size." },
        { q: "Will exported images have a watermark?", a: "No. Images are clean and ready to use." },
      ],
      keywords: ["pdf to image for students", "export pdf pages as jpg", "pdf diagram to image student", "pdf to png for slides"],
      related: ["for-teachers", "free", "without-watermark"],
    },
    {
      slug: "for-teachers",
      label: "For Teachers",
      h1: "PDF to Image for Teachers",
      metaTitle: "PDF to Image for Teachers — Export Pages for Worksheets & Slides",
      metaDescription:
        "Convert PDF pages to images for teachers: export worksheet pages, diagrams, and slides as JPG or PNG. Free, no watermark, no signup. Files auto-delete in 12 hours.",
      heroDescription:
        "Convert PDF pages to images for teachers — export worksheet pages, textbook diagrams, and slide content as JPG or PNG for your own materials.",
      icon: FileImage,
      intro: [
        "Building your own worksheets and slides often means reusing diagrams and pages from existing PDFs. Exporting those pages as images lets you insert them directly into your materials.",
        "Convert any PDF into JPG or PNG images at your chosen resolution, then drop them into worksheets, slides, or handouts.",
      ],
      benefits: [
        { title: "Reuse textbook diagrams", body: "Export diagrams and charts as images for your own worksheets and slides." },
        { title: "Build worksheet pages", body: "Turn existing PDF pages into image assets you can rebuild into activities." },
        { title: "Print-quality exports", body: "Choose 300 DPI for images that stay sharp on the photocopier." },
        { title: "Clean, professional output", body: "No watermark — your materials stay professional." },
      ],
      steps: [
        { title: "Upload your PDF", body: "Select the textbook, worksheet, or resource with the pages you need." },
        { title: "Choose format and resolution", body: "Pick JPG or PNG, and 300 DPI for print-quality images." },
        { title: "Convert and build", body: "Download the images and insert them into your materials." },
      ],
      faq: [
        { q: "Can I use textbook diagrams in my worksheets?", a: "Yes. Export them as images and insert them, respecting your school's copyright policy." },
        { q: "What resolution should I use for printing?", a: "Choose 300 DPI for print-quality worksheets and handouts." },
        { q: "Are exported images clean?", a: "Yes. No watermark is added." },
      ],
      keywords: ["pdf to image for teachers", "export textbook diagrams pdf", "pdf pages as jpg teacher", "worksheet image pdf"],
      related: ["for-students", "free", "online"],
    },
  ],
};
