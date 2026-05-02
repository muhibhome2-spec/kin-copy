import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function gbp(pence: number, opts: { compact?: boolean } = {}) {
  const v = pence / 100;
  if (opts.compact && v >= 1000) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency", currency: "GBP",
      notation: "compact", maximumFractionDigits: 1,
    }).format(v);
  }
  return new Intl.NumberFormat("en-GB", {
    style: "currency", currency: "GBP", maximumFractionDigits: 0,
  }).format(v);
}

export function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]?.toUpperCase()).join("");
}

export function relativeDays(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
