import type { SeoFaqItem } from "@/lib/seo";

export function FaqSection({
  faqs,
  pageSlug,
}: {
  faqs: SeoFaqItem[];
  pageSlug: string;
}) {
  if (!faqs?.length) return null;

  return (
    <section className="mt-12">
      <h2 className="text-lg font-bold text-ink mb-4">
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group rounded-2xl border border-border-soft bg-surface overflow-hidden"
          >
            <summary className="flex items-center justify-between px-5 py-4 font-medium text-ink cursor-pointer hover:bg-page transition-colors">
              <span className="pr-4">{faq.q}</span>
              <svg
                className="shrink-0 w-4 h-4 text-ink-2 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 pb-4 text-sm text-ink-2 leading-relaxed">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
