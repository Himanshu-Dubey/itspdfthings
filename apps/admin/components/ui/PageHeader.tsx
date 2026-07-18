import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

/** Material-Dashboard-style navbar: transparent, breadcrumb + bold title, sits above the page content. */
export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex items-center justify-between gap-4 px-6 h-20 shrink-0",
        "bg-page/80 backdrop-blur-md",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium text-ink-2">Admin</p>
        <h1 className="text-lg font-bold text-ink truncate">{title}</h1>
        {description && <p className="text-xs text-ink-2 mt-0.5 truncate">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </header>
  );
}
