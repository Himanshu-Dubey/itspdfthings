"use client";

import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";

const CONSENT_KEY = "cookie_consent";

type ConsentState = "accepted" | "rejected" | null;

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentState;
    if (!stored) setVisible(true);
  }, []);

  const respond = ( accepted: boolean) => {
    localStorage.setItem(CONSENT_KEY, accepted ? "accepted" : "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto bg-white border border-border-soft rounded-2xl shadow-xl p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <Cookie size={20} className="text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-ink mb-1">We value your privacy</h3>
            <p className="text-xs text-ink-2 leading-relaxed mb-4">
              We use cookies to enhance your experience, analyze site usage, and assist in our
              marketing efforts. By clicking &quot;Accept&quot;, you consent to the use of cookies for
              analytics purposes. You can manage your preferences at any time.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => respond(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-br from-red-500 to-brand-dark text-white text-xs font-bold shadow-brand hover:shadow-lg transition-all cursor-pointer"
              >
                Accept
              </button>
              <button
                onClick={() => respond(false)}
                className="px-4 py-2 rounded-xl border border-border-soft text-ink-2 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
              >
                Reject
              </button>
            </div>
          </div>
          <button
            onClick={() => respond(false)}
            className="text-ink-2 hover:text-ink transition-colors shrink-0 cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
