"use client";

import { useState } from "react";

const PROVIDERS = [
  {
    id: "facebook",
    label: "Facebook",
    className: "bg-[#1877F2] text-white border-[#1877F2] hover:bg-[#1465D8]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
      </svg>
    ),
  },
  {
    id: "google",
    label: "Google",
    className: "bg-white text-ink border-border-soft hover:bg-slate-50",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
        <path fill="#FBBC05" d="M5.84 14.09A6.96 6.96 0 0 1 5.44 12c0-.73.13-1.43.4-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
      </svg>
    ),
  },
  {
    id: "sso",
    label: "SSO",
    className: "bg-white text-ink border-border-soft hover:bg-slate-50",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="9" cy="7" r="4" />
        <path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
        <path d="M16 3.5a4 4 0 0 1 0 7" />
      </svg>
    ),
  },
];

export function SocialAuthButtons() {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div>
      <div className="grid grid-cols-3 gap-2.5">
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setNotice(`${p.label} sign-in is coming soon.`)}
            className={`flex items-center justify-center gap-2 border rounded-lg py-2.5 text-sm font-semibold transition-colors cursor-pointer ${p.className}`}
          >
            {p.icon}
            <span className="hidden sm:inline">{p.label}</span>
          </button>
        ))}
      </div>
      {notice && <p className="text-xs text-ink-2 text-center mt-2.5">{notice}</p>}

      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-border-soft" />
        <span className="text-xs text-ink-2">or continue with email</span>
        <div className="h-px flex-1 bg-border-soft" />
      </div>
    </div>
  );
}
