import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthIllustration } from "./AuthIllustration";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col bg-white">
        {/* Top bar with back link */}
        <div className="px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink transition-colors group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to home
          </Link>
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-4 pb-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
      <AuthIllustration />
    </div>
  );
}
