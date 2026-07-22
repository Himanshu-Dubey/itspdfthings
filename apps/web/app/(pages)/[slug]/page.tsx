import type { Metadata } from "next";
import { notFound } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://api.itspdfthings.com";

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

async function getPage(slug: string): Promise<Page | null> {
  try {
    const res = await fetch(`${API_URL}/api/pages/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.page ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};

  return {
    title: page.meta_title || page.title,
    description: page.meta_description || undefined,
    openGraph: {
      title: page.meta_title || page.title,
      description: page.meta_description || undefined,
    },
  };
}

export default async function StaticPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <main className="min-h-[60vh]">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight mb-8">
          {page.title}
        </h1>
        {page.content && (
          <div
            className="prose prose-slate max-w-none prose-headings:text-ink prose-p:text-ink-2 prose-a:text-brand prose-li:text-ink-2"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        )}
      </div>
    </main>
  );
}
