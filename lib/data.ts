import { engagementScore } from "./engagement";

export type Tier = "none" | "small_change" | "patron" | "major";
export type PaymentMethod = "caf" | "justgiving" | "launchgood" | "bank_transfer" | "cash" | "other";

export type Donor = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  postcode: string;
  tier: Tier;
  tags: string[];
  isConvert: boolean;
  giftAidOnFile: boolean;
  joinedAt: string;
  notes?: string;
};

export type Gift = {
  id: string;
  donorId: string;
  campaignId: string;
  amount: number; // pence
  date: string;
  method: PaymentMethod;
  giftAidEligible: boolean;
  giftAidClaimed: boolean;
  zakahFlag?: boolean;
  restrictedFund?: string;
};

export type Campaign = {
  id: string;
  name: string;
  slug: string;
  type: "monthly" | "ramadan" | "endowment" | "patron" | "event" | "product" | "one_off";
  goalPence: number;
  description: string;
  active: boolean;
};

export const campaigns: Campaign[] = [
  { id: "c1", name: "Small Change", slug: "small-change", type: "monthly", goalPence: 6000000, description: "Flagship monthly donor programme. Min £3/month.", active: true },
  { id: "c2", name: "My 10 Nights", slug: "my-10-nights", type: "ramadan", goalPence: 4000000, description: "Automated nightly giving across the last 10 nights of Ramadan.", active: true },
  { id: "c3", name: "iWaqf Endowment", slug: "iwaqf", type: "endowment", goalPence: 10000000, description: "Long-term endowment for sustainability.", active: true },
  { id: "c4", name: "Patron Circle", slug: "patron", type: "patron", goalPence: 3000000, description: "Top-tier recurring supporters.", active: true },
  { id: "c5", name: "Shahadah Box", slug: "shahadah-box", type: "product", goalPence: 1500000, description: "Sponsor a welcome box for a new convert.", active: true },
  { id: "c6", name: "Eid BBQ 2026", slug: "eid-bbq", type: "event", goalPence: 800000, description: "Community Eid celebration in Manchester.", active: true },
  { id: "c7", name: "Spain Retreat", slug: "spain-retreat", type: "event", goalPence: 2200000, description: "Annual women's retreat in Andalusia.", active: true },
  { id: "c8", name: "General Fund", slug: "general", type: "one_off", goalPence: 5000000, description: "Unrestricted giving.", active: true },
];

const firstNames = ["Aisha","Yusuf","Maryam","Hamza","Sarah","Ibrahim","Khadija","Bilal","Layla","Idris","Fatima","Zayd","Amina","Tariq","Rumaisa","Sulaiman","Hafsa","Adam","Noor","Imran","Safiya","Junaid","Halima","Ismail","Ruqayyah","Musa","Asiya","Saad","Iman","Khalid","Zainab","Rayyan","Sumayya","Daud","Aaliyah","Nuh"];
const lastNames = ["Ahmed","Khan","Patel","Iqbal","Rahman","Hussain","Begum","Ali","Malik","Siddiqui","Choudhury","Akhtar","Sheikh","Faruqi","Yusuf","Williams","Brown","Hughes","O'Connor","Lewis","Smith","Roberts","Green","Carter","Murphy"];
const cities = [
  ["Manchester","M14"],["London","E1"],["London","SE15"],["Birmingham","B12"],["Bradford","BD8"],
  ["Cardiff","CF24"],["Glasgow","G41"],["Leeds","LS6"],["London","NW6"],["Leicester","LE5"],
];
const tagPool = ["convert","family-of-convert","workshop-attendee","umrah-2024","eid-bbq-2024","vip","gift-aid-on-file","regular-volunteer","ramadan-only","media-shy"];

// Deterministic PRNG so SSR matches
function mulberry(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry(42);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)]!;

export const donors: Donor[] = Array.from({ length: 60 }).map((_, i) => {
  const fn = pick(firstNames);
  const ln = pick(lastNames);
  const [city, pc] = pick(cities);
  const tier: Tier = rand() < 0.08 ? "patron" : rand() < 0.4 ? "small_change" : "none";
  const tags: string[] = [];
  for (const t of tagPool) if (rand() < 0.18) tags.push(t);
  const joinedDays = Math.floor(rand() * 1100);
  return {
    id: `d${i + 1}`,
    firstName: fn, lastName: ln,
    email: `${fn.toLowerCase()}.${ln.toLowerCase().replace("'","")}@example.org`,
    city, postcode: `${pc} ${Math.floor(rand() * 9)}${"ABDEFG"[Math.floor(rand()*6)]}${"FGHJKL"[Math.floor(rand()*6)]}`,
    tier, tags, isConvert: rand() < 0.4, giftAidOnFile: rand() < 0.8,
    joinedAt: new Date(Date.now() - joinedDays * 86400000).toISOString(),
  };
});

// generate gifts
export const gifts: Gift[] = (() => {
  const out: Gift[] = [];
  let n = 0;
  for (const d of donors) {
    const giftCount = d.tier === "patron" ? 18 + Math.floor(rand() * 12) : d.tier === "small_change" ? 6 + Math.floor(rand() * 18) : 1 + Math.floor(rand() * 6);
    for (let i = 0; i < giftCount; i++) {
      const daysAgo = Math.floor(rand() * 900);
      const date = new Date(Date.now() - daysAgo * 86400000);
      // Ramadan spike: April 2024 / March 2025
      const month = date.getUTCMonth();
      const ramadanish = (month === 2 || month === 3);
      const cId = ramadanish && rand() < 0.5 ? "c2" : pick(campaigns).id;
      const amt = d.tier === "patron"
        ? (5000 + Math.floor(rand() * 30000))
        : d.tier === "small_change"
          ? (300 + Math.floor(rand() * 2000))
          : (1000 + Math.floor(rand() * 8000));
      out.push({
        id: `g${++n}`,
        donorId: d.id,
        campaignId: cId,
        amount: amt,
        date: date.toISOString(),
        method: pick(["caf","justgiving","launchgood","bank_transfer","cash"]) as PaymentMethod,
        giftAidEligible: d.giftAidOnFile && rand() < 0.95,
        giftAidClaimed: rand() < 0.6,
        zakahFlag: rand() < 0.005,
        restrictedFund: cId === "c3" ? "iwaqf" : cId === "c5" ? "shahadah_box" : "general",
      });
    }
  }
  return out.sort((a, b) => +new Date(b.date) - +new Date(a.date));
})();

export function donorStats(donorId: string) {
  const ds = gifts.filter((g) => g.donorId === donorId);
  if (!ds.length) return { total: 0, count: 0, avg: 0, lastGift: null as string | null, firstGift: null as string | null, score: 0, tier: "dormant" as const };
  const total = ds.reduce((s, g) => s + g.amount, 0);
  const dates = ds.map((g) => +new Date(g.date));
  const last = Math.max(...dates), first = Math.min(...dates);
  const cutoff = Date.now() - 730 * 86400000;
  const last24 = ds.filter((g) => +new Date(g.date) >= cutoff);
  const e = engagementScore({
    daysSinceLastGift: Math.floor((Date.now() - last) / 86400000),
    giftsLast24Mo: last24.length,
    totalLast24Mo: last24.reduce((s, g) => s + g.amount, 0) / 100,
    isNew: ds.length === 1 && (Date.now() - first) / 86400000 < 90,
  });
  return {
    total, count: ds.length, avg: Math.round(total / ds.length),
    lastGift: new Date(last).toISOString(),
    firstGift: new Date(first).toISOString(),
    score: e.score, tier: e.tier,
  };
}

export function getDonor(id: string) { return donors.find((d) => d.id === id); }

export function campaignProgress(c: Campaign) {
  const raised = gifts.filter((g) => g.campaignId === c.id).reduce((s, g) => s + g.amount, 0);
  return { raised, pct: Math.min(100, (raised / c.goalPence) * 100) };
}

// Monthly raised (last 12 months) stacked by campaign
export function monthlySeries() {
  const months: { key: string; label: string; date: Date }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleString("en-GB", { month: "short" }),
      date: d,
    });
  }
  return months.map((m) => {
    const row: any = { month: m.label };
    for (const c of campaigns) row[c.slug] = 0;
    for (const g of gifts) {
      const gd = new Date(g.date);
      if (gd.getFullYear() === m.date.getFullYear() && gd.getMonth() === m.date.getMonth()) {
        const slug = campaigns.find((c) => c.id === g.campaignId)?.slug;
        if (slug) row[slug] += g.amount / 100;
      }
    }
    return row;
  });
}

export const campaignColours: Record<string, string> = {
  "small-change": "oklch(0.55 0.09 178)",
  "my-10-nights": "oklch(0.78 0.13 78)",
  "iwaqf": "oklch(0.6 0.1 250)",
  "patron": "oklch(0.65 0.13 30)",
  "shahadah-box": "oklch(0.68 0.1 145)",
  "eid-bbq": "oklch(0.7 0.13 60)",
  "spain-retreat": "oklch(0.6 0.09 300)",
  "general": "oklch(0.6 0.02 240)",
};

// Communications queue (unsent thank-yous)
export const ackQueue = gifts
  .filter((g, i) => i < 14)
  .map((g) => {
    const d = donors.find((x) => x.id === g.donorId)!;
    return { gift: g, donor: d };
  });
