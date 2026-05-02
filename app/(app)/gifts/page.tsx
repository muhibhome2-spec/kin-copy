import { Topbar } from "@/components/shell/topbar";
import { campaigns, gifts, getDonor } from "@/lib/data";
import { gbp, initials } from "@/lib/utils";
import { AlertTriangle, BadgeCheck, Plus, Upload } from "lucide-react";

export default function GiftsPage() {
  const totals = {
    sum: gifts.reduce((s, g) => s + g.amount, 0),
    count: gifts.length,
    avg: Math.round(gifts.reduce((s, g) => s + g.amount, 0) / gifts.length),
    ga: gifts.filter((g) => g.giftAidEligible).reduce((s, g) => s + g.amount, 0),
  };

  return (
    <>
      <Topbar crumbs={["gifts"]} />
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h1 className="font-serif text-[1.7rem]">gifts</h1>
            <p className="text-[0.85rem] mt-0.5" style={{ color: "var(--color-muted)" }}>
              ledger view · {gifts.length.toLocaleString("en-GB")} gifts
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn"><Upload className="w-3.5 h-3.5" />import csv</button>
            <button className="btn btn-primary"><Plus className="w-3.5 h-3.5" />add gift</button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-5">
          <Stat label="total" value={gbp(totals.sum, { compact: true })} />
          <Stat label="gifts" value={totals.count.toString()} />
          <Stat label="avg gift" value={gbp(totals.avg)} />
          <Stat label="gift-aid eligible" value={gbp(totals.ga, { compact: true })} colour="var(--color-success)" />
        </div>

        <div className="card overflow-hidden">
          <table className="w-full text-[0.85rem]">
            <thead>
              <tr style={{ background: "var(--color-surface-2)", color: "var(--color-muted)" }}>
                <th className="px-4 py-2.5 text-left font-medium text-[0.72rem] uppercase tracking-wider">donor</th>
                <th className="px-3 py-2.5 text-left font-medium text-[0.72rem] uppercase tracking-wider">campaign</th>
                <th className="px-3 py-2.5 text-left font-medium text-[0.72rem] uppercase tracking-wider">method</th>
                <th className="px-3 py-2.5 text-left font-medium text-[0.72rem] uppercase tracking-wider">date</th>
                <th className="px-3 py-2.5 text-right font-medium text-[0.72rem] uppercase tracking-wider">amount</th>
                <th className="px-3 py-2.5 text-center font-medium text-[0.72rem] uppercase tracking-wider">flags</th>
              </tr>
            </thead>
            <tbody>
              {gifts.slice(0, 60).map((g) => {
                const d = getDonor(g.donorId);
                const c = campaigns.find((x) => x.id === g.campaignId);
                return (
                  <tr key={g.id} className="border-t hover:bg-[var(--color-surface-2)]">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[0.65rem] font-semibold"
                          style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)" }}>
                          {d ? initials(`${d.firstName} ${d.lastName}`) : "?"}
                        </div>
                        <span>{d?.firstName} {d?.lastName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">{c?.name}</td>
                    <td className="px-3 py-2.5" style={{ color: "var(--color-muted)" }}>{g.method.replace("_", " ")}</td>
                    <td className="px-3 py-2.5" style={{ color: "var(--color-muted)" }}>
                      {new Date(g.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-medium">{gbp(g.amount)}</td>
                    <td className="px-3 py-2.5 text-center">
                      <div className="inline-flex items-center justify-center gap-1">
                        {g.giftAidEligible && <BadgeCheck className="w-3.5 h-3.5" style={{ color: g.giftAidClaimed ? "var(--color-success)" : "var(--color-muted)" }} />}
                        {g.zakahFlag && <AlertTriangle className="w-3.5 h-3.5" style={{ color: "var(--color-danger)" }} />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, colour }: { label: string; value: string; colour?: string }) {
  return (
    <div className="card p-3">
      <div className="kicker">{label}</div>
      <div className="font-serif text-[1.3rem] mt-1" style={colour ? { color: colour } : undefined}>{value}</div>
    </div>
  );
}
