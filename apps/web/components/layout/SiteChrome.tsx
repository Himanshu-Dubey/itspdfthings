"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Heart, Megaphone, X } from "lucide-react";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { useState } from "react";

const CHROMELESS_ROUTES = ["/login", "/register"];

interface Announcement {
  message: string | null;
  link: string | null;
  expires_at: string | null;
}

export function SiteChrome({
  children,
  announcement,
}: {
  children: React.ReactNode;
  announcement?: Announcement | null;
}) {
  const pathname = usePathname();
  const chromeless = CHROMELESS_ROUTES.includes(pathname);
  const [dismissed, setDismissed] = useState(false);

  const showBanner = !!announcement?.message && !dismissed;

  if (chromeless) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      {showBanner && (
        <div className="relative z-40 bg-brand text-white">
          <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-medium">
            <Megaphone size={15} className="shrink-0 opacity-80" />
            <span className="text-center">
              {announcement.link ? (
                <Link
                  href={announcement.link}
                  className="underline underline-offset-2 hover:no-underline"
                >
                  {announcement.message}
                </Link>
              ) : (
                announcement.message
              )}
            </span>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss announcement"
              className="shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer ml-auto absolute right-4"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border-soft py-8 text-center text-sm text-ink-2">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-brand text-white">
            <Heart size={12} fill="currentColor" strokeWidth={0} />
          </span>
          <span className="font-semibold text-ink">PDFThings</span>
        </div>
        <div className="flex items-center justify-center gap-4 mb-2">
          <Link href="/privacy" className="hover:text-ink transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-ink transition-colors">Terms of Service</Link>
        </div>
        <p>© {new Date().getFullYear()} PDFThings. Files auto-deleted after 12 hours.</p>
      </footer>
    </>
  );
}
