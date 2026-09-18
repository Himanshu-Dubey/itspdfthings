import type { Metadata } from "next";
import { getSeoData, buildPageMetadata } from "@/lib/seo";
import { FaqSection } from "@/components/tools/FaqSection";
import { JsonLd } from "@/components/tools/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData();
  return buildPageMetadata("pricing", seo);
}

export default async function PricingLayout({ children }: { children: React.ReactNode }) {
  const seo = await getSeoData();
  const pricingData = seo.pages["pricing"];

  return (
    <>
      {children}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <FaqSection faqs={pricingData?.faq ?? []} pageSlug="pricing" />
      </div>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: "PDFThings Premium",
        description: "Unlimited PDF tools, higher file size limits, priority processing.",
        brand: { "@type": "Brand", name: "PDFThings" },
        image: "https://itspdfthings.com/og/default.png",
        offers: [
          {
            "@type": "Offer",
            priceCurrency: "USD",
            price: "9.99",
            availability: "https://schema.org/InStock",
            url: "https://itspdfthings.com/pricing",
          },
          {
            "@type": "Offer",
            priceCurrency: "INR",
            price: "799",
            availability: "https://schema.org/InStock",
            url: "https://itspdfthings.com/pricing",
          },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "1250",
          bestRating: "5",
          worstRating: "1",
        },
        review: {
          "@type": "Review",
          author: {
            "@type": "Organization",
            name: "PDFThings",
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5",
          },
          reviewBody: "Great value for unlimited PDF tools with no ads.",
        },
      }} />
    </>
  );
}
