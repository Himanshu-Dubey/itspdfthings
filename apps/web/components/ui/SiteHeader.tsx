"use client";

import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Heart, Menu, X, LogOut, User, CreditCard, ChevronDown, FileText } from "lucide-react";
import { DarkModeToggle } from "./DarkModeToggle";

const TOOL_LINKS = [
  { href: "/merge-pdf", label: "Merge PDF" },
  { href: "/split-pdf", label: "Split PDF" },
  { href: "/compress-pdf", label: "Compress PDF" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

interface NavPage {
  id: number;
  title: string;
  slug: string;
}

function UserAvatar({ avatar, name, size = "sm" }: { avatar?: string | null; name: string; size?: "sm" | "md" }) {
  const sizeClasses = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";
  if (avatar) {
    const src = avatar.startsWith("/") ? avatar : `/api/files/${avatar}`;
    return <img src={src} alt={name} className={`${sizeClasses} rounded-full object-cover`} />;
  }
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  return (
    <span className={`${sizeClasses} inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand to-orange-400 text-white font-bold`}>
      {initials || "U"}
    </span>
  );
}

export function SiteHeader({ headerPages = [] }: { headerPages?: NavPage[] }) {
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hardcodedHrefs = new Set(TOOL_LINKS.map((l) => l.href));
  const navLinks = [
    ...TOOL_LINKS,
    ...headerPages
      .filter((p) => !hardcodedHrefs.has(`/${p.slug}`))
      .map((p) => ({ href: `/${p.slug}`, label: p.title })),
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

        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <div className="hidden sm:flex items-center gap-3">
            {loading ? (
              <div className="h-9 w-24 bg-white/5 rounded-lg animate-pulse" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <UserAvatar avatar={user.avatar} name={user.name} />
                  <ChevronDown size={14} className={`text-zinc-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
                      <UserAvatar avatar={user.avatar} name={user.name} size="md" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="py-1.5">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <User size={14} className="shrink-0" />
                        Profile & Settings
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <FileText size={14} className="shrink-0" />
                        PDF Jobs
                      </Link>
                      {user.plan === "free" && (
                        <Link
                          href="/pricing"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-amber-400 hover:bg-white/5 hover:text-amber-300 transition-colors"
                        >
                          <CreditCard size={14} className="shrink-0" />
                          Upgrade to Premium
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-white/10 py-1.5">
                      <button
                        onClick={() => { setDropdownOpen(false); logout(); }}
                        className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                      >
                        <LogOut size={14} className="shrink-0" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <UserAvatar avatar={user.avatar} name={user.name} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Profile & Settings
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  PDF Jobs
                </Link>
                {user.plan === "free" && (
                  <Link
                    href="/pricing"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-amber-400 hover:bg-white/5 hover:text-amber-300 transition-colors"
                  >
                    Upgrade to Premium
                  </Link>
                )}
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
