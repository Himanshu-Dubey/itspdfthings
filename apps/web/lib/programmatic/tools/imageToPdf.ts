import { ImageIcon } from "lucide-react";
import { makeTool, type PlatformSeed } from "../platformFactory";
import type { ProgrammaticTool } from "../types";

const seed: PlatformSeed = {
  slug: "image-to-pdf",
  label: "Image to PDF",
  canonicalPath: "/image-to-pdf",
  toolConfig: {
    toolType: "image-to-pdf",
    label: "Convert to PDF",
    accept: ".jpg,.jpeg,.png,.webp,.gif,.tiff,image/*",
    multiple: true,
    maxFiles: 20,
  },
  verb: "Convert",
  noun: "images",
  actionLabel: "Convert to PDF",
  desc: "Convert JPG and PNG images to PDF documents.",
  fileLimit: "up to 20 images per job",
  includeWithoutWatermark: true,
  keywordsBase: "image to pdf",
  intro: [
    "Turning a set of photos or scans into a single PDF is the cleanest way to send them: one file, proper page order, easy to print or email. Whether it's camera photos, phone scans, or exported graphics, this tool builds a PDF in seconds.",
    "Upload up to 20 JPG, PNG, WEBP, GIF, or TIFF images, arrange them in order, and download one clean PDF. No watermark, no signup, and your images auto-delete within 12 hours.",
  ],
  benefits: [
    { title: "One PDF from many images", body: "Combine JPG, PNG, WEBP, GIF, or TIFF images into a single document." },
    { title: "Keep your order", body: "Arrange images before conversion so the PDF pages follow your sequence." },
    { title: "Print-ready output", body: "A proper PDF is the best format for printing photos, scans, and documents." },
    { title: "Clean output", body: "No watermark is added to your converted PDF." },
  ],
  steps: [
    { title: "Upload your images", body: "Select up to 20 JPG, PNG, WEBP, GIF, or TIFF images." },
    { title: "Arrange the order", body: "Drag images into the order you want them to appear in the PDF." },
    { title: "Convert and download", body: "Convert the images and download your PDF." },
  ],
  faq: [
    { q: "What image formats are supported?", a: "JPG, PNG, WEBP, GIF, and TIFF images are supported." },
    { q: "Can I convert photos from my phone?", a: "Yes. Upload photos from your phone and they're converted into a PDF." },
    { q: "Can I combine images of different sizes?", a: "Yes. Each image becomes a page in your PDF, fitted to the page." },
  ],
};

const tool = makeTool(seed);

export const imageToPdfTool: ProgrammaticTool = {
  ...tool,
  variants: [
    ...tool.variants,
    // ── Audience variants ────────────────────────────────────────────────
    {
      slug: "for-students",
      label: "For Students",
      h1: "Image to PDF for Students",
      metaTitle: "Image to PDF for Students — Turn Photos of Notes Into a PDF",
      metaDescription:
        "Convert images to PDF for students: turn photos of handwritten notes, whiteboards, and scanned pages into one document. Free, no watermark, no signup. Files auto-delete in 12 hours.",
      heroDescription:
        "Convert images to PDF for students — turn photos of whiteboards, handwritten notes, and printed pages into a single document you can submit, print, or study from.",
      icon: ImageIcon,
      intro: [
        "Your phone's camera is a scanner: whiteboard diagrams, handwritten notes, and printed handouts all become photos. But a folder of loose images is hard to submit or print — converting them into one PDF fixes that.",
        "Upload up to 20 photos, arrange them in order, and download a single PDF of your notes. Ideal for study guides, submission-ready scans, or printing.",
      ],
      benefits: [
        { title: "Notes into one file", body: "Turn photos of whiteboards and handwritten notes into a single PDF." },
        { title: "Submission-ready scans", body: "Convert photos of forms and printed pages into a PDF most portals accept." },
        { title: "Study-friendly", body: "Combine photos of textbook pages into one document for exam revision." },
        { title: "Free and instant", body: "No signup or watermark — convert in seconds before a deadline." },
      ],
      steps: [
        { title: "Upload your photos", body: "Select up to 20 images of notes, whiteboards, or pages." },
        { title: "Put them in order", body: "Arrange the photos the way you want the pages to appear." },
        { title: "Convert and study or submit", body: "Download the PDF and submit, print, or study from it." },
      ],
      faq: [
        { q: "Can I turn photos of handwritten notes into a PDF?", a: "Yes. Upload the photos and they become clean PDF pages." },
        { q: "Can I combine photos of different sizes?", a: "Yes. Each photo becomes a page, fitted to the PDF page." },
        { q: "Will the PDF have a watermark?", a: "No. Output is clean and ready to submit or print." },
      ],
      keywords: ["image to pdf for students", "convert photos of notes to pdf", "photo to pdf student", "scan notes to pdf"],
      related: ["for-teachers", "free", "without-watermark"],
    },
    {
      slug: "for-teachers",
      label: "For Teachers",
      h1: "Image to PDF for Teachers",
      metaTitle: "Image to PDF for Teachers — Turn Photos Into Handouts",
      metaDescription:
        "Convert images to PDF for teachers: turn photos of student work, whiteboards, and printed materials into printable handouts. Free, no watermark, no signup. Files auto-delete in 12 hours.",
      heroDescription:
        "Convert images to PDF for teachers — turn photos of student work, whiteboard content, and printed materials into a single printable handout or shareable file.",
      icon: ImageIcon,
      intro: [
        "Student work arrives as photos, whiteboard content lives in camera rolls, and useful pages from books need scanning. Converting those images into one PDF makes them printable and shareable with a class.",
        "Upload up to 20 images, arrange them, and download a PDF you can print, share on your LMS, or email to parents.",
      ],
      benefits: [
        { title: "Printable handouts", body: "Convert photos of materials into a PDF ready for the copier." },
        { title: "Share on your LMS", body: "Upload a single PDF of student work or resources instead of loose images." },
        { title: "Preserve whiteboard content", body: "Turn whiteboard photos into pages you can reuse and print." },
        { title: "Clean, professional output", body: "No watermark — handouts stay professional for parents and students." },
      ],
      steps: [
        { title: "Upload your images", body: "Select up to 20 photos of student work, whiteboards, or materials." },
        { title: "Arrange the pages", body: "Order the images the way you want the handout to read." },
        { title: "Convert and distribute", body: "Download the PDF and print or share it with your class." },
      ],
      faq: [
        { q: "Can I print photos of student work?", a: "Yes. Convert the photos into a PDF and print clean, ordered pages." },
        { q: "Can I share a photo-based handout on my LMS?", a: "Yes. Convert to PDF first and upload a single file." },
        { q: "Are converted PDFs print quality?", a: "Yes. Pages are fitted to the PDF and print cleanly." },
      ],
      keywords: ["image to pdf for teachers", "photos to pdf handout", "convert whiteboard photos to pdf", "student work photos to pdf"],
      related: ["for-students", "free", "online"],
    },
  ],
};
