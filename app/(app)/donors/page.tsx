import { Topbar } from "@/components/shell/topbar";
import { Ring } from "@/components/ring";
import { donors, donorStats } from "@/lib/data";
import { tierColour, tierLabel } from "@/lib/engagement";
import { gbp, initials, relativeDays } from "@/lib/utils";
import { Plus, Upload, Filter, BadgeCheck } from "lucide-react";
import Link from "next/link";

const tierBadge: Record<string, { label: string; colour: string; bg: string }> = {
  patron: { label: "patron", colour: "var(--color-accent)", bg: "var(--color-accent-soft)" },
  small_change: { label: "small change", colour: "var(--color-primary)", bg: "var(--color-primary-soft)" },
  none: { label: "supporter", colour: "var(--color-muted)", bg: "var(--color-surface-2)" },
  major: { label: "major", colour: "var(--color-accent)", bg: "var(--color-accent-soft)" },
};

export default function DonorsPage() {
  const rows = donors.map((d) => ({ d, s: donorStats(d.id) })).sort((a, b) => b.s.total - a.s.total);

  return (
    <>
      <Topbar crumbs={["donors"]} />
      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h1 className="font-serif text-[1.7rem]">donors</h1>
              <p className="text-[0.85rem] mt-0.5" style={{ color: "var(--color-muted)" }}>
                {donors.length} people · {donors.filter((d) => d.giftAidOnFile).length} with gift aid on file · {donors.filter((d) => d.isConvert).length} converts
              </p>
            </div>
            <div className="flex gap-2">
              <button className="btn"><Filter className="w-3.5 h-3.5" />filters</button>
              <button className="btn"><Upload className="w-3.5 h-3.5" />import</button>
              <button className="btn btn-primary"><Plus className="w-3.5 h-3.5" />new donor</button>
            </div>
          </div>

          {/* stats strip */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            <Stat label="lifetime raised" value={gbp(rows.reduce((s, r) => s + r.s.total, 0), { compact: true })} />
            <Stat label="avg. lifetime gift" value={gbp(Math.round(rows.reduce((s, r) => s + r.s.total, 0) / Math.max(1, rows.reduce((s, r) => s + r.s.count, 0))))} />
            <Stat label="champions" value={rows.filter((r) => r.s.tier === "champion").length.toString()} />
            <Stat label="at risk + lapsed" value={rows.filter((r) => r.s.tier === "at_risk" || r.s.tier === "lapsed").length.toString()} />
          </div>

          <div className="card overflow-hidden">
            <table className="w-full text-[0.85rem]">
              <thead>
                <tr className="text-left" style={{ background: "var(--color-surface-2)", color: "var(--color-muted)" }}>
                  <th className="px-4 py-2.5 font-medium text-[0.72rem] uppercase tracking-wider">donor</th>
                  <th className="px-3 py-2.5 font-medium text-[0.72rem] uppercase tracking-wider">tier</th>
                  <th className="px-3 py-2.5 font-medium text-[0.72rem] uppercase tracking-wider text-right">lifetime</th>
                  <th className="px-3 py-2.5 font-medium text-[0.72rem] uppercase tracking-wider">last gift</th>
                  <th className="px-3 py-2.5 font-medium text-[0.72rem] uppercase tracking-wider">tags</th>
                  <th className="px-3 py-2.5 font-medium text-[0.72rem] uppercase tracking-wider text-center">engagement</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 40).map(({ d, s }) => {
                  const tb = tierBadge[d.tier];
                  return (
                    <tr key={d.id} className="border-t hover:bg-[var(--color-surface-2)] transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/donors/${d.id}`} className="flex items-center gap-3 group">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[0.7rem] font-semibold shrink-0"
                            style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)" }}>
                            {initials(`${d.firstName} ${d.lastName}`)}
                          </div>
                          <div>
                            <div className="font-medium group-hover:underline flex items-center gap-1.5">
                              {d.firstName} {d.lastName}
                              {d.giftAidOnFile && <BadgeCheck className="w-3.5 h-3.5" style={{ color: "var(--color-success)" }} />}
                            </div>
                            <div className="text-[0.72rem]" style={{ color: "var(--color-muted)" }}>
                              {d.city} · {d.email}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-3 py-3">
                        <span className="pill" style={{ background: tb.bg, color: tb.colour, borderColor: "transparent" }}>
                          {tb.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right font-medium tabular-nums">{gbp(s.total, { compact: true })}</td>
                      <td className="px-3 py-3 text-[0.78rem]" style={{ color: "var(--color-muted)" }}>
                        {s.lastGift ? relativeDays(s.lastGift) : "—"}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {d.tags.slice(0, 2).map((t) => (
                            <span key={t} className="pill text-[0.65rem]">{t}</span>
                          ))}
                          {d.tags.length > 2 && <span className="text-[0.7rem]" style={{ color: "var(--color-muted)" }}>+{d.tags.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Ring value={s.score} size={28} stroke={3} colour={tierColour[s.tier]} label="" />
                          <span className="text-[0.72rem]" style={{ color: tierColour[s.tier] }}>
                            {tierLabel[s.tier]}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-3">
      <div className="kicker">{label}</div>
      <div className="font-serif text-[1.3rem] mt-1">{value}</div>
    </div>
  );
}
