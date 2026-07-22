"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Tag,
  Briefcase,
  ShieldAlert,
  Settings,
  ClipboardList,
  Server,
  LogOut,
  Zap,
  PackagePlus,
  Search,
} from "lucide-react";
import { useAdminAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard",    href: "/dashboard",    icon: LayoutDashboard, section: "main" },
  { label: "Users",        href: "/users",        icon: Users,           section: "main" },
  { label: "Subscriptions",href: "/subscriptions",icon: CreditCard,      section: "main" },
  { label: "Quotas & Tools", href: "/pricing",    icon: Tag,             section: "main" },
  { label: "Jobs",         href: "/jobs",         icon: Briefcase,       section: "main" },
  { label: "Abuse",        href: "/abuse",        icon: ShieldAlert,     section: "main" },
  { label: "Plans",        href: "/plans",        icon: PackagePlus,     section: "billing" },
  { label: "Stripe",       href: "/stripe",       icon: Zap,             section: "billing" },
  { label: "Razorpay",     href: "/razorpay",     icon: CreditCard,      section: "billing" },
  { label: "Pages",         href: "/pages",         icon: ClipboardList,   section: "system" },
  { label: "SEO",           href: "/seo",           icon: Search,          section: "system" },
  { label: "Settings",     href: "/settings",     icon: Settings,        section: "system" },
  { label: "Audit Log",    href: "/audit-log",    icon: ClipboardList,   section: "system" },
  { label: "System Health",href: "/system",       icon: Server,          section: "system" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAdminAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const mainItems    = navItems.filter((i) => i.section === "main");
  const billingItems = navItems.filter((i) => i.section === "billing");
  const systemItems  = navItems.filter((i) => i.section === "system");

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 p-3">
      <div className="h-full flex flex-col rounded-2xl bg-surface border border-border-soft shadow-soft">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 shrink-0">
          <span className="text-ink font-extrabold text-base tracking-tight">PDFThings</span>
          <span className="ml-2 text-brand text-[10px] font-bold bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
            Admin
          </span>
        </div>
        <div className="mx-4 h-px bg-border-soft shrink-0" />

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto sidebar-scroll">
          <NavGroup label="Main"    items={mainItems}    pathname={pathname} />
          <NavGroup label="Billing" items={billingItems} pathname={pathname} />
          <NavGroup label="System"  items={systemItems}  pathname={pathname} />
        </nav>

        {/* Admin user */}
        <div className="px-3 py-3 border-t border-border-soft shrink-0">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors group">
            <div className="h-8 w-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
              {admin?.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-ink truncate">{admin?.name ?? "Admin"}</p>
              <p className="text-[10px] text-ink-2 capitalize">{admin?.role ?? "superadmin"}</p>
            </div>
            <button
              onClick={handleLogout}
              aria-label="Log out"
              className="text-ink-2 hover:text-brand transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavGroup({
  label,
  items,
  pathname,
}: {
  label: string;
  items: typeof navItems;
  pathname: string;
}) {
  return (
    <div className="mb-4">
      <p className="px-3 mb-1.5 text-[10px] font-bold text-ink-2 uppercase tracking-wider">
        {label}
      </p>
      <ul className="space-y-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-gradient-to-br from-red-500 to-brand-dark text-white shadow-brand"
                    : "text-ink-2 hover:bg-slate-50 hover:text-ink",
                ].join(" ")}
              >
                <item.icon size={16} className="shrink-0" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
