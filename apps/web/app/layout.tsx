import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { Wrench } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PDFThings — Free PDF Tools Online",
    template: "%s | PDFThings",
  },
  description:
    "Merge, split, compress, and convert PDFs online. Fast, free, and private — files deleted after 12 hours.",
};

interface SiteStatus {
  maintenance_mode: boolean;
  announcement: {
    message: string | null;
    link: string | null;
    expires_at: string | null;
  };
}

async function getSiteStatus(): Promise<SiteStatus> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://api.itspdfthings.com";
    const res = await fetch(`${apiUrl}/api/tools/status`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return { maintenance_mode: false, announcement: { message: null, link: null, expires_at: null } };
    return res.json();
  } catch {
    return { maintenance_mode: false, announcement: { message: null, link: null, expires_at: null } };
  }
}

function isAnnouncementActive(ann: SiteStatus["announcement"]): boolean {
  if (!ann.message) return false;
  if (!ann.expires_at) return true;
  return new Date(ann.expires_at) > new Date();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const status = await getSiteStatus();
  const showAnnouncement = isAnnouncementActive(status.announcement);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-page text-ink">
        {status.maintenance_mode ? (
          <MaintenancePage />
        ) : (
          <AuthProvider>
            <SiteChrome
              announcement={showAnnouncement ? status.announcement : null}
            >
              {children}
            </SiteChrome>
          </AuthProvider>
        )}
      </body>
    </html>
  );
}

function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-page px-4 text-center">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-brand-dark shadow-[0_8px_32px_rgba(220,38,38,0.35)] mb-8">
        <Wrench size={36} className="text-white" />
      </div>
      <h1 className="text-3xl font-bold text-ink mb-3 tracking-tight">We&apos;ll be right back</h1>
      <p className="text-ink-2 max-w-sm text-balance">
        PDFThings is currently undergoing scheduled maintenance. We&apos;ll be back online shortly — check back in a few minutes.
      </p>
      <p className="mt-8 text-xs text-ink-2/60">
        © {new Date().getFullYear()} PDFThings
      </p>
    </div>
  );
}
