export type EngagementTier = "champion" | "loyal" | "potential" | "at_risk" | "lapsed" | "dormant" | "new";

export function engagementScore(input: {
  daysSinceLastGift: number;
  giftsLast24Mo: number;
  totalLast24Mo: number; // £
  isNew?: boolean;
}): { score: number; tier: EngagementTier; r: number; f: number; m: number } {
  const r = Math.max(0, 100 - input.daysSinceLastGift / 3);
  const f = Math.min(100, input.giftsLast24Mo * 12);
  const m = Math.min(100, Math.sqrt(Math.max(0, input.totalLast24Mo)) * 4);
  let score = Math.round(0.4 * r + 0.3 * f + 0.3 * m);
  if (input.isNew) { score = Math.min(50, score); return { score, tier: "new", r, f, m }; }
  let tier: EngagementTier = "dormant";
  if (score >= 80) tier = "champion";
  else if (score >= 60) tier = "loyal";
  else if (score >= 40) tier = "potential";
  else if (score >= 20) tier = "at_risk";
  else if (score > 0) tier = "lapsed";
  return { score, tier, r, f, m };
}

export const tierLabel: Record<EngagementTier, string> = {
  champion: "champion",
  loyal: "loyal",
  potential: "potential",
  at_risk: "at risk",
  lapsed: "lapsed",
  dormant: "dormant",
  new: "new",
};

export const tierColour: Record<EngagementTier, string> = {
  champion: "var(--color-accent)",
  loyal: "var(--color-primary)",
  potential: "oklch(0.7 0.1 200)",
  at_risk: "oklch(0.72 0.12 60)",
  lapsed: "oklch(0.65 0.1 30)",
  dormant: "oklch(0.6 0.02 240)",
  new: "oklch(0.7 0.13 155)",
};
