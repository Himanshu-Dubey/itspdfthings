"use client";

import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useState } from "react";
import { Heart, Menu, X } from "lucide-react";

const TOOL_LINKS = [
  { href: "/merge-pdf", label: "Merge PDF" },
  { href: "/split-pdf", label: "Split PDF" },
  { href: "/compress-pdf", label: "Compress PDF" },
  { href: "/contact", label: "Contact" },
  { href: "/", label: "All tools" },
];

interface NavPage {
  id: number;
  title: string;
  slug: string;
}

export function SiteHeader({ headerPages = [] }: { headerPages?: NavPage[] }) {
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    ...TOOL_LINKS,
    ...headerPages.map((p) => ({ href: `/${p.slug}`, label: p.title })),
  ];

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white shadow-[0_0_16px_rgba(220,38,38,0.5)]">
            <Heart size={15} fill="currentColor" strokeWidth={0} />
          </span>
          <span className="font-bold text-lg text-white tracking-tight">PDFThings</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            {loading ? (
              <div className="h-9 w-24 bg-white/5 rounded-lg animate-pulse" />
            ) : user ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  aria-label="Account settings"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-colors"
                >
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors shadow-[0_0_16px_rgba(220,38,38,0.35)]"
                >
                  Sign up free
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-white/10 bg-zinc-950 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 mt-2 border-t border-white/10 space-y-1">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Account Settings
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-semibold bg-brand text-white text-center hover:bg-brand-dark transition-colors"
                >
                  Sign up free
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
