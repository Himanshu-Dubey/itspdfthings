import Link from "next/link";
import { Heart, Combine, Minimize2, Lock, ArrowRight } from "lucide-react";

const QUICK_START = [
  { href: "/merge-pdf", label: "Merge PDF", icon: Combine, iconBg: "bg-red-50", iconText: "text-red-600" },
  { href: "/compress-pdf", label: "Compress PDF", icon: Minimize2, iconBg: "bg-amber-50", iconText: "text-amber-600" },
  { href: "/protect-pdf", label: "Protect PDF", icon: Lock, iconBg: "bg-indigo-50", iconText: "text-indigo-600" },
];

export function AuthSuccess({ name }: { name: string }) {
  const firstName = name.trim().split(" ")[0] || name;

  return (
    <div className="min-h-screen flex items-center justify-center bg-page px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <div className="pop-in flex justify-center mb-8">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white shadow-soft">
            <Heart size={20} fill="currentColor" strokeWidth={0} />
          </span>
        </div>

        <div className="pop-in flex justify-center mb-6" style={{ animationDelay: "0.15s" }}>
          <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
            <circle cx="44" cy="44" r="42" stroke="#d1fae5" strokeWidth="4" />
            <circle
              className="draw-circle"
              cx="44" cy="44" r="42"
              stroke="#10b981" strokeWidth="4" strokeLinecap="round"
              transform="rotate(-90 44 44)"
            />
            <path
              className="draw-check"
              d="M30 45l10 10 18-20"
              stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
            />
          </svg>
        </div>

        <h1 className="fade-up text-2xl font-bold text-ink mb-2" style={{ animationDelay: "0.3s" }}>
          You&apos;re all set!
        </h1>
        <p className="fade-up text-ink-2 mb-8" style={{ animationDelay: "0.38s" }}>
          Welcome to PDFThings, {firstName}! Your account is ready to go.
        </p>

        <div className="fade-up mb-8" style={{ animationDelay: "0.46s" }}>
          <p className="text-xs font-semibold text-ink-2 uppercase tracking-wide mb-3">Jump right in</p>
          <div className="grid grid-cols-3 gap-2.5">
            {QUICK_START.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex flex-col items-center gap-2 rounded-xl border border-border-soft p-3 hover:border-brand/40 hover:shadow-soft transition-all"
              >
                <span className={`h-9 w-9 rounded-lg ${tool.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <tool.icon size={16} className={tool.iconText} />
                </span>
                <span className="text-xs font-medium text-ink text-center leading-tight">{tool.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/"
          className="fade-up inline-flex items-center justify-center gap-2 w-full bg-brand text-white py-3 rounded-xl font-semibold hover:bg-brand-dark transition-colors shadow-soft"
          style={{ animationDelay: "0.54s" }}
        >
          Start using PDFThings
          <ArrowRight size={16} />
        </Link>

        <Link
          href="/dashboard"
          className="fade-up block text-sm text-ink-2 hover:text-ink mt-4 transition-colors"
          style={{ animationDelay: "0.6s" }}
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
