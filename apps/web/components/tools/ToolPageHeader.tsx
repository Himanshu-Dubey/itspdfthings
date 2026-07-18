import type { LucideIcon } from "lucide-react";

interface ToolPageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBg: string;
  iconText: string;
  glow: string;
}

export function ToolPageHeader({ icon: Icon, title, description, iconBg, iconText, glow }: ToolPageHeaderProps) {
  return (
    <div className="relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-b ${glow} to-transparent`} aria-hidden="true" />
      <div className="relative max-w-3xl mx-auto px-4 pt-16 pb-8 text-center">
        <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${iconBg} mb-5 shadow-soft`}>
          <Icon size={28} className={iconText} strokeWidth={1.75} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3 tracking-tight text-balance">{title}</h1>
        <p className="text-ink-2 text-lg max-w-xl mx-auto text-balance">{description}</p>
      </div>
    </div>
  );
}
