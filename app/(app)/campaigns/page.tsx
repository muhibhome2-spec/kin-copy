import { Topbar } from "@/components/shell/topbar";
import { campaignColours, campaignProgress, campaigns, gifts } from "@/lib/data";
import { gbp } from "@/lib/utils";
import { ArrowUpRight, Users, HandCoins } from "lucide-react";

export default function CampaignsPage() {
  return (
    <>
      <Topbar crumbs={["campaigns"]} />
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h1 className="font-serif text-[1.7rem]">campaigns</h1>
            <p className="text-[0.85rem] mt-0.5" style={{ color: "var(--color-muted)" }}>
              {campaigns.filter((c) => c.active).length} active · {gbp(campaigns.reduce((s, c) => s + c.goalPence, 0), { compact: true })} total goal this year
            </p>
          </div>
          <button className="btn btn-primary">+ new campaign</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {campaigns.map((c) => {
            const p = campaignProgress(c);
            const cGifts = gifts.filter((g) => g.campaignId === c.id);
            const donorCount = new Set(cGifts.map((g) => g.donorId)).size;
            return (
              <div key={c.id} className="card p-5 group hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: campaignColours[c.slug] }} />
                      <h3 className="font-serif text-[1.2rem]">{c.name}</h3>
                      <span className="pill text-[0.65rem]">{c.type.replace("_", " ")}</span>
                    </div>
                    <p className="text-[0.825rem] mt-2" style={{ color: "var(--color-muted)" }}>{c.description}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--color-muted)" }} />
                </div>
                <div className="mt-5">
                  <div className="flex items-baseline justify-between mb-2">
                    <div className="font-serif text-[1.4rem]">{gbp(p.raised, { compact: true })}</div>
                    <div className="text-[0.78rem]" style={{ color: "var(--color-muted)" }}>
                      of {gbp(c.goalPence, { compact: true })} · {p.pct.toFixed(0)}%
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-surface-2)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${p.pct}%`, background: campaignColours[c.slug] }} />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex items-center gap-5 text-[0.78rem]" style={{ color: "var(--color-muted)" }}>
                  <span className="inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{donorCount} donors</span>
                  <span className="inline-flex items-center gap-1.5"><HandCoins className="w-3.5 h-3.5" />{cGifts.length} gifts</span>
                  <span>avg {gbp(cGifts.length ? Math.round(p.raised / cGifts.length) : 0)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
