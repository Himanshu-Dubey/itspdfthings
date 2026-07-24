import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { BlogToolCTA } from "@/components/blog/BlogToolCTA";
import { ReadingProgress } from "@/components/blog/ReadingProgress";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.itspdfthings.com";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  reading_time: number | null;
  published_at: string | null;
  allow_comments: boolean;
  category: { id: number; name: string; slug: string } | null;
  tags: { id: number; name: string; slug: string }[];
  author: { id: number; name: string } | null;
  author_name: string | null;
}

interface RecentPost {
  id: number;
  title: string;
  slug: string;
  featured_image: string | null;
  published_at: string | null;
  reading_time: number | null;
}

interface BlogDetailData {
  post: BlogPost;
  recent_posts: RecentPost[];
}

async function getPost(slug: string): Promise<BlogDetailData | null> {
  try {
    const res = await fetch(`${API_URL}/api/blog/${slug}`, { cache: "no-store" });
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPost(slug);
  if (!data) return { title: "Post Not Found" };

  const { post } = data;
  const ogImage = post.og_image || post.featured_image;
  const ogImageUrl = imageUrl(ogImage);
  const baseUrl = "https://itspdfthings.com";

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    openGraph: {
      title: post.og_title || post.title,
      description: post.og_description || post.excerpt || undefined,
      url: `${baseUrl}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: post.author_name ? [post.author_name] : undefined,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.og_title || post.title,
      description: post.og_description || post.excerpt || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPost(slug);
  if (!data) notFound();

  const { post, recent_posts } = data;
  const ogImage = post.og_image || post.featured_image;
  const ogImageUrl = imageUrl(ogImage);
  const baseUrl = "https://itspdfthings.com";

  return (
    <div className="min-h-screen">
      <ReadingProgress />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: post.title,
              description: post.excerpt || undefined,
              image: ogImageUrl || undefined,
              datePublished: post.published_at || undefined,
              author: post.author ? { "@type": "Person", name: post.author.name } : undefined,
              publisher: {
                "@type": "Organization",
                name: "PDFThings",
                logo: { "@type": "ImageObject", url: `${baseUrl}/logo.png` },
              },
              mainEntityOfPage: { "@type": "WebPage", "@id": `${baseUrl}/blog/${post.slug}` },
            }),
          }}
        />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-ink-2 mb-8">
          <Link href="/" className="hover:text-brand transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-brand transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-ink truncate">{post.title}</span>
        </nav>

        {/* Article header */}
        <article>
          <header className="mb-8">
            {post.category && (
              <Link
                href={`/blog?category=${post.category.slug}`}
                className="text-xs font-bold text-brand uppercase tracking-wider hover:underline"
              >
                {post.category.name}
              </Link>
            )}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight mt-2 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-ink-2">
              {post.author_name && <span>By {post.author_name}</span>}
              {post.published_at && <span>{formatDate(post.published_at)}</span>}
              {post.reading_time && <span>{post.reading_time} min read</span>}
            </div>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/blog?tag=${tag.slug}`}
                    className="px-3 py-1 rounded-full border border-border-soft text-xs text-ink-2 hover:border-brand hover:text-brand transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}
          </header>

          {/* Featured image */}
          {post.featured_image && (
            <div className="mb-8 rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={imageUrl(post.featured_image)}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Content */}
          {post.content && (
            <div
              className="cms-content prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {/* Share buttons */}
          <div className="mt-8 pt-6 border-t border-border-soft">
            <ShareButtons title={post.title} slug={post.slug} />
          </div>
        </article>

        {/* Tool CTAs */}
        <BlogToolCTA />

        {/* Related posts */}
        {recent_posts.length > 0 && (
          <section className="mt-16 border-t border-border-soft pt-12">
            <h2 className="text-2xl font-bold text-ink mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recent_posts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/blog/${rp.slug}`}
                  className="group rounded-2xl border border-border-soft bg-surface overflow-hidden hover:shadow-lg hover:border-border-muted transition-all"
                >
                  {rp.featured_image && (
                    <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                      <img
                        src={imageUrl(rp.featured_image)}
                        alt={rp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-ink group-hover:text-brand transition-colors line-clamp-2">
                      {rp.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-ink-2 mt-2">
                      {rp.published_at && <span>{formatDate(rp.published_at)}</span>}
                      {rp.reading_time && <span>· {rp.reading_time} min</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
