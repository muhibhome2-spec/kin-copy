"use client";

import { Search, Bell, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function Topbar({ crumbs }: { crumbs?: string[] }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  }
  return (
    <header className="h-14 border-b flex items-center justify-between px-6" style={{ background: "var(--color-surface)" }}>
      <div className="text-sm" style={{ color: "var(--color-muted)" }}>
        {(crumbs ?? []).map((c, i) => (
          <span key={i}>
            {i > 0 && <span className="mx-2">/</span>}
            <span className={i === (crumbs!.length - 1) ? "text-[var(--color-fg)] font-medium" : ""}>{c}</span>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3 flex-1 max-w-md mx-8">
        <div className="flex items-center gap-2 w-full px-3 py-1.5 rounded-md border text-sm" style={{ background: "var(--color-surface-2)" }}>
          <Search className="w-3.5 h-3.5" style={{ color: "var(--color-muted)" }} />
          <input
            placeholder="search donors, gifts, campaigns…"
            className="bg-transparent outline-none flex-1 text-[0.825rem]"
          />
          <span className="text-[0.7rem] font-mono" style={{ color: "var(--color-muted)" }}>⌘K</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={toggle} className="btn !p-1.5" aria-label="theme">
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button className="btn !p-1.5" aria-label="notifications">
          <Bell className="w-4 h-4" />
        </button>
        <div className="ml-2 w-8 h-8 rounded-full flex items-center justify-center text-[0.75rem] font-semibold"
          style={{ background: "var(--color-primary)", color: "var(--color-primary-fg)" }}>
          AK
        </div>
      </div>
    </header>
  );
}
