import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight, BookOpen, Folder } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.itspdfthings.com";

export const metadata: Metadata = {
  title: "Blog",
  description: "PDF tips, tutorials, and product updates from PDFThings.",
  openGraph: {
    title: "Blog | PDFThings",
    description: "PDF tips, tutorials, and product updates from PDFThings.",
    url: "https://itspdfthings.com/blog",
  },
};

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  reading_time: number | null;
  published_at: string | null;
  category: { id: number; name: string; slug: string } | null;
}

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  posts_count?: number;
}

interface BlogData {
  posts: { data: BlogPost[]; current_page: number; last_page: number; total: number };
  categories: BlogCategory[];
}

async function getBlogData(): Promise<BlogData | null> {
  try {
    const res = await fetch(`${API_URL}/api/blog`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function imageUrl(url: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
}

export default async function BlogPage() {
  const data = await getBlogData();
  const posts = data?.posts?.data ?? [];
  const categories = data?.categories ?? [];
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen">
      {/* ── Schema ─────────────────────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Blog | PDFThings",
            description: "PDF tips, tutorials, and product updates from PDFThings.",
            url: "https://itspdfthings.com/blog",
            isPartOf: {
              "@type": "WebSite",
              name: "PDFThings",
              url: "https://itspdfthings.com",
            },
            hasPart: posts.map((post) => ({
              "@type": "Article",
              headline: post.title,
              url: `https://itspdfthings.com/blog/${post.slug}`,
              datePublished: post.published_at || undefined,
              author: { "@type": "Organization", name: "PDFThings" },
              publisher: {
                "@type": "Organization",
                name: "PDFThings",
                url: "https://itspdfthings.com",
                logo: { "@type": "ImageObject", url: "https://itspdfthings.com/file.svg" },
              },
            })),
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border-soft">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/80 via-white to-orange-50/60" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 mb-5">
            <BookOpen size={12} />
            {posts.length} article{posts.length !== 1 ? "s" : ""}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-ink tracking-tight mb-4">
            PDF tips, tutorials &amp; guides
          </h1>
          <p className="text-lg text-ink-2 max-w-xl mx-auto">
            Learn how to merge, split, compress, and manage PDFs like a pro — straight from the PDFThings team.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ── Empty state ─────────────────────────────────────────────────── */}
        {posts.length === 0 && (
          <div className="text-center py-24">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 mb-5">
              <BookOpen size={28} className="text-red-400" />
            </div>
            <p className="text-ink-2 text-lg font-medium">No blog posts yet.</p>
            <p className="text-ink-2/60 text-sm mt-1">Check back soon — we&apos;re cooking up something great.</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          {/* ── Main content (left) ─────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Featured post */}
            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="group block rounded-2xl border border-border-soft bg-surface overflow-hidden mb-10 hover:shadow-xl hover:border-border-muted transition-all duration-300"
              >
                {featured.featured_image ? (
                  <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={imageUrl(featured.featured_image)}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
                    <BookOpen size={48} className="text-red-200" />
                  </div>
                )}
                <div className="p-7">
                  {featured.category && (
                    <span className="inline-flex self-start rounded-full bg-red-50 border border-red-200 px-3 py-0.5 text-[11px] font-bold text-red-700 uppercase tracking-wider mb-3">
                      {featured.category.name}
                    </span>
                  )}
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mb-3 group-hover:text-brand transition-colors leading-tight">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="text-ink-2 leading-relaxed mb-4 line-clamp-2">
                      {featured.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-ink-2">
                      {featured.published_at && <span>{formatDate(featured.published_at)}</span>}
                      {featured.reading_time && (
                        <span className="inline-flex items-center gap-1">
                          <Clock size={13} /> {featured.reading_time} min read
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand group-hover:gap-2.5 transition-all">
                      Read <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Remaining posts grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {rest.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group rounded-2xl border border-border-soft bg-surface overflow-hidden hover:shadow-lg hover:-translate-y-1 hover:border-border-muted transition-all duration-300"
                  >
                    {post.featured_image ? (
                      <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                        <img
                          src={imageUrl(post.featured_image)}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                        <BookOpen size={28} className="text-slate-200" />
                      </div>
                    )}
                    <div className="p-5">
                      {post.category && (
                        <span className="inline-flex rounded-full bg-red-50 border border-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-700 uppercase tracking-wider mb-2">
                          {post.category.name}
                        </span>
                      )}
                      <h2 className="text-base font-bold text-ink mb-2 group-hover:text-brand transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-ink-2 line-clamp-2 mb-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-ink-2 pt-3 border-t border-border-soft">
                        {post.published_at && <span>{formatDate(post.published_at)}</span>}
                        {post.reading_time && (
                          <span className="inline-flex items-center gap-1">
                            <Clock size={11} /> {post.reading_time} min
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar (right) ──────────────────────────────────────────────── */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Categories */}
              {categories.length > 0 && (
                <div className="rounded-2xl border border-border-soft bg-surface p-5">
                  <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Folder size={14} className="text-brand" />
                    Categories
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        href="/blog"
                        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium bg-brand text-white transition-colors"
                      >
                        <span>All posts</span>
                        <span className="text-xs opacity-80">{posts.length}</span>
                      </Link>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          href={`/blog?category=${cat.slug}`}
                          className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-ink-2 hover:bg-red-50 hover:text-brand transition-colors"
                        >
                          <span>{cat.name}</span>
                          {cat.posts_count != null && (
                            <span className="text-xs text-ink-2/60 bg-page rounded-full px-2 py-0.5">
                              {cat.posts_count}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Newsletter CTA */}
              <div className="rounded-2xl border border-border-soft bg-gradient-to-br from-red-50 to-orange-50 p-5 text-center">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm mb-3">
                  <BookOpen size={18} className="text-brand" />
                </div>
                <h3 className="text-sm font-bold text-ink mb-1">Stay updated</h3>
                <p className="text-xs text-ink-2 mb-3">Get the latest PDF tips delivered to your inbox.</p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark transition-colors"
                >
                  Try PDFThings free
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
