import { Topbar } from "@/components/shell/topbar";
import { StackedRaisedChart } from "@/components/charts/area";
import { Sparkline } from "@/components/charts/sparkline";
import { Ring } from "@/components/ring";
import { campaigns, campaignColours, campaignProgress, donors, gifts, monthlySeries, ackQueue, donorStats } from "@/lib/data";
import { gbp, initials, relativeDays } from "@/lib/utils";
import { toHijri } from "@/lib/hijri";
import { ArrowUpRight, ArrowDownRight, AlertTriangle, BadgePoundSterling, Heart, UserPlus, Sparkles } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const thisMonthGifts = gifts.filter((g) => new Date(g.date) >= monthStart);
  const lastMonthGifts = gifts.filter((g) => new Date(g.date) >= lastMonthStart && new Date(g.date) < monthStart);
  const thisMonthTotal = thisMonthGifts.reduce((s, g) => s + g.amount, 0);
  const lastMonthTotal = lastMonthGifts.reduce((s, g) => s + g.amount, 0);
  const delta = lastMonthTotal ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

  const series = monthlySeries();
  const sparkData = series.map((m) => Object.entries(m).filter(([k]) => k !== "month").reduce((s, [, v]) => s + (v as number), 0));

  const monthlyDonors = donors.filter((d) => d.tier === "small_change" || d.tier === "patron").length;
  const giftAidUnclaimed = gifts.filter((g) => g.giftAidEligible && !g.giftAidClaimed).reduce((s, g) => s + g.amount * 0.25, 0);

  // retention: donors who gave in last 12mo AND prior 12mo
  const cutoffA = Date.now() - 365 * 86400000;
  const cutoffB = Date.now() - 730 * 86400000;
  const retainedSet = new Set<string>();
  const priorSet = new Set<string>();
  for (const g of gifts) {
    const t = +new Date(g.date);
    if (t >= cutoffA) retainedSet.add(g.donorId);
    else if (t >= cutoffB) priorSet.add(g.donorId);
  }
  const retained = [...priorSet].filter((d) => retainedSet.has(d)).length;
  const retention = priorSet.size ? Math.round((retained / priorSet.size) * 100) : 0;

  const hijri = toHijri(now);

  const flaggedZakah = gifts.find((g) => g.zakahFlag);
  const newestDonor = donors.slice().sort((a, b) => +new Date(b.joinedAt) - +new Date(a.joinedAt))[0];
  const lapsedPatrons = donors.filter((d) => {
    if (d.tier !== "patron") return false;
    const s = donorStats(d.id);
    return s.lastGift && (Date.now() - +new Date(s.lastGift)) / 86400000 > 60;
  }).length;

  return (
    <>
      <Topbar crumbs={["dashboard"]} />
      <div className="flex-1 overflow-auto px-8 py-7">
        {/* Hero */}
        <div className="mb-7">
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-serif text-[1.85rem] leading-tight">salaam, Aisha <span style={{ color: "var(--color-accent)" }}>·</span></h1>
              <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                here's how new beginnings is doing this month.
              </p>
            </div>
            <div className="text-right text-[0.8rem]" style={{ color: "var(--color-muted)" }}>
              <div>{now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
              <div className="font-serif italic">{hijri.full}</div>
            </div>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          <KPI
            kicker="raised this month"
            value={gbp(thisMonthTotal, { compact: true })}
            delta={delta}
            spark={sparkData}
          />
          <KPI
            kicker="active monthly donors"
            value={monthlyDonors.toString()}
            sub={`+${Math.round(monthlyDonors * 0.06)} this month`}
            chip={`${donors.filter((d) => d.tier === "patron").length} patrons`}
          />
          <KPIRing
            kicker="donor retention · 12mo"
            value={retention}
            sub={`${retained} of ${priorSet.size} retained`}
          />
          <KPICta
            kicker="gift aid unclaimed"
            value={gbp(giftAidUnclaimed, { compact: true })}
            sub={`${gifts.filter((g) => g.giftAidEligible && !g.giftAidClaimed).length} eligible gifts`}
            href="/gift-aid"
          />
        </div>

        {/* Chart + action queue */}
        <div className="grid grid-cols-12 gap-4 mb-5">
          <div className="card col-span-8 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="kicker">monthly raised · stacked by campaign</div>
                <h3 className="font-serif text-lg mt-0.5">last 12 months</h3>
              </div>
              <div className="flex gap-1 text-[0.75rem]">
                {["6m", "12m", "ytd", "all"].map((k) => (
                  <button key={k} className="pill" style={k === "12m" ? { background: "var(--color-primary-soft)", color: "var(--color-primary)", borderColor: "transparent" } : undefined}>{k}</button>
                ))}
              </div>
            </div>
            <StackedRaisedChart data={series} />
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-[0.72rem]" style={{ color: "var(--color-muted)" }}>
              {campaigns.map((c) => (
                <span key={c.slug} className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: campaignColours[c.slug] }} />
                  {c.name.toLowerCase()}
                </span>
              ))}
            </div>
          </div>

          <div className="card col-span-4 p-5">
            <div className="kicker">action queue</div>
            <h3 className="font-serif text-lg mt-0.5 mb-3">do this next</h3>
            <ul className="space-y-2">
              <ActionItem
                icon={<Heart className="w-4 h-4" />}
                tone="primary"
                title={`${ackQueue.length} unsent thank-yous`}
                hint="oldest waiting 4 days"
                href="/communications"
              />
              <ActionItem
                icon={<BadgePoundSterling className="w-4 h-4" />}
                tone="accent"
                title={`gift aid ready: ${gbp(giftAidUnclaimed, { compact: true })}`}
                hint="last claim 6 weeks ago"
                href="/gift-aid"
              />
              <ActionItem
                icon={<AlertTriangle className="w-4 h-4" />}
                tone="warning"
                title="1 gift flagged as zakah"
                hint={flaggedZakah ? `£${(flaggedZakah.amount / 100).toFixed(0)} · needs review` : ""}
                href="/gifts"
              />
              <ActionItem
                icon={<ArrowDownRight className="w-4 h-4" />}
                tone="muted"
                title={`${lapsedPatrons} lapsed patrons`}
                hint="no gift in 60+ days"
                href="/donors"
              />
              <ActionItem
                icon={<UserPlus className="w-4 h-4" />}
                tone="success"
                title={`new donor: ${newestDonor.firstName} ${newestDonor.lastName}`}
                hint="joined this week"
                href={`/donors/${newestDonor.id}`}
              />
              <ActionItem
                icon={<Sparkles className="w-4 h-4" />}
                tone="muted"
                title="ramadan begins in 38 days"
                hint="my 10 nights launches in 47"
              />
            </ul>
          </div>
        </div>

        {/* Campaign progress */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="kicker">campaigns</div>
              <h3 className="font-serif text-lg mt-0.5">progress vs goal</h3>
            </div>
            <Link href="/campaigns" className="text-[0.8rem] inline-flex items-center gap-1" style={{ color: "var(--color-primary)" }}>
              view all <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {campaigns.map((c) => {
              const p = campaignProgress(c);
              return (
                <div key={c.id}>
                  <div className="flex items-center justify-between mb-1.5 text-[0.825rem]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: campaignColours[c.slug] }} />
                      <span className="font-medium">{c.name}</span>
                      <span className="pill text-[0.65rem]">{c.type.replace("_", " ")}</span>
                    </div>
                    <div className="text-[0.75rem]" style={{ color: "var(--color-muted)" }}>
                      <span className="font-semibold text-[var(--color-fg)]">{gbp(p.raised, { compact: true })}</span>
                      {" "}of {gbp(c.goalPence, { compact: true })}
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-surface-2)" }}>
                    <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: campaignColours[c.slug] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function KPI({ kicker, value, delta, spark, sub, chip }: { kicker: string; value: string; delta?: number; spark?: number[]; sub?: string; chip?: string }) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="card p-4">
      <div className="kicker">{kicker}</div>
      <div className="flex items-end justify-between mt-1">
        <div className="font-serif text-[1.7rem] leading-none">{value}</div>
        {delta !== undefined && (
          <span className="text-[0.75rem] font-medium inline-flex items-center gap-0.5"
            style={{ color: positive ? "var(--color-success)" : "var(--color-danger)" }}>
            {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
        {chip && <span className="pill">{chip}</span>}
      </div>
      <div className="mt-2 text-[0.72rem]" style={{ color: "var(--color-muted)" }}>{sub ?? "vs same period last year"}</div>
      {spark && <div className="mt-1 -mx-1"><Sparkline data={spark} /></div>}
    </div>
  );
}

function KPIRing({ kicker, value, sub }: { kicker: string; value: number; sub: string }) {
  return (
    <div className="card p-4 flex items-center gap-4">
      <Ring value={value} size={64} stroke={6} colour="var(--color-primary)" label={`${value}%`} />
      <div>
        <div className="kicker">{kicker}</div>
        <div className="font-serif text-[1.7rem] leading-none mt-1">{value}%</div>
        <div className="mt-1 text-[0.72rem]" style={{ color: "var(--color-muted)" }}>{sub}</div>
      </div>
    </div>
  );
}

function KPICta({ kicker, value, sub, href }: { kicker: string; value: string; sub: string; href: string }) {
  return (
    <Link href={href} className="card p-4 block transition-shadow hover:shadow-md" style={{ background: "linear-gradient(135deg, var(--color-accent-soft), var(--color-surface))" }}>
      <div className="kicker">{kicker}</div>
      <div className="flex items-end justify-between mt-1">
        <div className="font-serif text-[1.7rem] leading-none">{value}</div>
        <ArrowUpRight className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
      </div>
      <div className="mt-2 text-[0.72rem]" style={{ color: "var(--color-muted)" }}>{sub} · claim now</div>
    </Link>
  );
}

function ActionItem({ icon, title, hint, href, tone }: { icon: React.ReactNode; title: string; hint: string; href?: string; tone: "primary" | "accent" | "warning" | "success" | "muted" }) {
  const colours: Record<string, string> = {
    primary: "var(--color-primary)",
    accent: "var(--color-accent)",
    warning: "var(--color-danger)",
    success: "var(--color-success)",
    muted: "var(--color-muted)",
  };
  const Inner = (
    <div className="flex items-start gap-3 px-2.5 py-2 rounded-md hover:bg-[var(--color-surface-2)] transition-colors -mx-2.5">
      <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: "var(--color-surface-2)", color: colours[tone] }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[0.825rem] font-medium leading-tight">{title}</div>
        <div className="text-[0.72rem] mt-0.5" style={{ color: "var(--color-muted)" }}>{hint}</div>
      </div>
    </div>
  );
  return <li>{href ? <Link href={href}>{Inner}</Link> : Inner}</li>;
}
