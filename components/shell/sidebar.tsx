"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, HandCoins, Megaphone, MessageSquareHeart, BadgePoundSterling, FileBarChart, Filter, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "dashboard", icon: LayoutDashboard },
  { href: "/donors", label: "donors", icon: Users },
  { href: "/gifts", label: "gifts", icon: HandCoins },
  { href: "/campaigns", label: "campaigns", icon: Megaphone },
  { href: "/communications", label: "communications", icon: MessageSquareHeart },
  { href: "/gift-aid", label: "gift aid", icon: BadgePoundSterling },
  { href: "/reports", label: "reports", icon: FileBarChart },
  { href: "/segments", label: "segments", icon: Filter },
  { href: "/settings", label: "settings", icon: Settings },
];

function Star({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-hidden>
      <path d="M12 2 L13.6 9.4 L21 11 L13.6 12.6 L12 20 L10.4 12.6 L3 11 L10.4 9.4 Z" />
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 shrink-0 border-r flex flex-col" style={{ background: "var(--color-surface)" }}>
      <div className="px-5 py-5 flex items-center gap-2.5">
        <Star className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
        <div>
          <div className="font-serif text-[1.05rem] leading-tight font-semibold">new beginnings</div>
          <div className="text-[0.65rem] tracking-wider uppercase" style={{ color: "var(--color-muted)" }}>barakah crm</div>
        </div>
      </div>
      <nav className="px-2.5 flex-1">
        {items.map((it) => {
          const active = pathname.startsWith(it.href);
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-[0.85rem] mb-0.5 transition-colors",
                active
                  ? "font-medium"
                  : "hover:bg-[var(--color-surface-2)]"
              )}
              style={active ? { background: "var(--color-primary-soft)", color: "var(--color-primary)" } : undefined}
            >
              <Icon className="w-4 h-4" strokeWidth={1.8} />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t text-[0.75rem]" style={{ color: "var(--color-muted)" }}>
        <div className="flex items-center justify-between">
          <span>⌘K to search</span>
          <span className="font-serif italic">barakah</span>
        </div>
      </div>
    </aside>
  );
}
