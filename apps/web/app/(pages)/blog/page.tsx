import type { Metadata } from "next";
import Link from "next/link";

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

  return (
    <div className="min-h-screen">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-ink tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-lg text-ink-2 max-w-2xl mx-auto">
            PDF tips, tutorials, and product updates.
          </p>
        </div>

        {/* Categories */}
        {data?.categories && data.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <Link
              href="/blog"
              className="px-4 py-1.5 rounded-full bg-brand text-white text-sm font-semibold"
            >
              All
            </Link>
            {data.categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}`}
                className="px-4 py-1.5 rounded-full border border-border-soft bg-surface text-sm text-ink-2 hover:border-brand hover:text-brand transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Posts grid */}
        {!data || data.posts.data.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-ink-2 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.posts.data.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-border-soft bg-surface overflow-hidden hover:shadow-lg hover:border-border-muted transition-all"
              >
                {post.featured_image && (
                  <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={imageUrl(post.featured_image)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  {post.category && (
                    <span className="text-[10px] font-bold text-brand uppercase tracking-wider">
                      {post.category.name}
                    </span>
                  )}
                  <h2 className="text-lg font-bold text-ink mt-1 mb-2 group-hover:text-brand transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-ink-2 line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-ink-2">
                    {post.published_at && <span>{formatDate(post.published_at)}</span>}
                    {post.reading_time && <span>· {post.reading_time} min read</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
