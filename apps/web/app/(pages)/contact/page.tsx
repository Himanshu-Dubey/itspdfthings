import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us - PDFThings",
  description:
    "Get in touch with the PDFThings team. Send us a message about support, feedback, or business inquiries.",
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
      <div className="text-center mb-10">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mx-auto mb-4">
          <Mail size={24} className="text-red-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight mb-3">
          Contact Us
        </h1>
        <p className="text-ink-2 text-base max-w-md mx-auto">
          Have a question, feedback, or need support? We would love to hear from you.
          Fill out the form below and we will get back to you shortly.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border-soft shadow-soft p-8">
        <ContactForm />
      </div>
    </div>
  );
}
