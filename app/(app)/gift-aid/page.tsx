import { Topbar } from "@/components/shell/topbar";
import { donors, gifts, getDonor, campaigns } from "@/lib/data";
import { gbp } from "@/lib/utils";
import { Download, BadgeCheck, AlertCircle } from "lucide-react";

export default function GiftAidPage() {
  const eligibleUnclaimed = gifts.filter((g) => g.giftAidEligible && !g.giftAidClaimed);
  const totalUplift = eligibleUnclaimed.reduce((s, g) => s + g.amount * 0.25, 0);
  const totalAmount = eligibleUnclaimed.reduce((s, g) => s + g.amount, 0);
  const noDecl = donors.filter((d) => !d.giftAidOnFile).length;

  return (
    <>
      <Topbar crumbs={["gift aid"]} />
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h1 className="font-serif text-[1.7rem]">gift aid</h1>
            <p className="text-[0.85rem] mt-0.5" style={{ color: "var(--color-muted)" }}>
              hmrc r68(i) compatible · charity reg. 1195427
            </p>
          </div>
          <button className="btn btn-primary"><Download className="w-3.5 h-3.5" />build claim</button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="card p-5" style={{ background: "linear-gradient(135deg, var(--color-accent-soft), var(--color-surface))" }}>
            <div className="kicker">unclaimed uplift</div>
            <div className="font-serif text-[2rem] mt-1">{gbp(totalUplift, { compact: true })}</div>
            <div className="text-[0.78rem] mt-1" style={{ color: "var(--color-muted)" }}>
              from {gbp(totalAmount, { compact: true })} of eligible giving
            </div>
          </div>
          <div className="card p-5">
            <div className="kicker">eligible gifts</div>
            <div className="font-serif text-[2rem] mt-1">{eligibleUnclaimed.length}</div>
            <div className="text-[0.78rem] mt-1" style={{ color: "var(--color-muted)" }}>across {new Set(eligibleUnclaimed.map((g) => g.donorId)).size} donors</div>
          </div>
          <div className="card p-5">
            <div className="kicker">missing declarations</div>
            <div className="font-serif text-[2rem] mt-1">{noDecl}</div>
            <div className="text-[0.78rem] mt-1 inline-flex items-center gap-1" style={{ color: "var(--color-warning)" }}>
              <AlertCircle className="w-3 h-3" />send request emails →
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div>
              <div className="kicker">eligible · unclaimed</div>
              <h3 className="font-serif text-lg mt-0.5">included in next claim</h3>
            </div>
            <div className="text-[0.78rem]" style={{ color: "var(--color-muted)" }}>last submitted 6 weeks ago · ref. NB-2026-Q1</div>
          </div>
          <table className="w-full text-[0.85rem]">
            <thead>
              <tr style={{ background: "var(--color-surface-2)", color: "var(--color-muted)" }}>
                <th className="px-4 py-2.5 text-left font-medium text-[0.72rem] uppercase tracking-wider w-8"></th>
                <th className="px-3 py-2.5 text-left font-medium text-[0.72rem] uppercase tracking-wider">donor</th>
                <th className="px-3 py-2.5 text-left font-medium text-[0.72rem] uppercase tracking-wider">postcode</th>
                <th className="px-3 py-2.5 text-left font-medium text-[0.72rem] uppercase tracking-wider">campaign</th>
                <th className="px-3 py-2.5 text-left font-medium text-[0.72rem] uppercase tracking-wider">date</th>
                <th className="px-3 py-2.5 text-right font-medium text-[0.72rem] uppercase tracking-wider">gift</th>
                <th className="px-3 py-2.5 text-right font-medium text-[0.72rem] uppercase tracking-wider">uplift</th>
                <th className="px-3 py-2.5 text-center font-medium text-[0.72rem] uppercase tracking-wider">decl.</th>
              </tr>
            </thead>
            <tbody>
              {eligibleUnclaimed.slice(0, 30).map((g) => {
                const d = getDonor(g.donorId)!;
                const c = campaigns.find((x) => x.id === g.campaignId);
                return (
                  <tr key={g.id} className="border-t hover:bg-[var(--color-surface-2)]">
                    <td className="px-4 py-2.5"><input type="checkbox" defaultChecked /></td>
                    <td className="px-3 py-2.5 font-medium">{d.firstName} {d.lastName}</td>
                    <td className="px-3 py-2.5 tabular-nums" style={{ color: "var(--color-muted)" }}>{d.postcode}</td>
                    <td className="px-3 py-2.5" style={{ color: "var(--color-muted)" }}>{c?.name}</td>
                    <td className="px-3 py-2.5" style={{ color: "var(--color-muted)" }}>{new Date(g.date).toLocaleDateString("en-GB")}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{gbp(g.amount)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-medium" style={{ color: "var(--color-success)" }}>{gbp(g.amount * 0.25)}</td>
                    <td className="px-3 py-2.5 text-center">
                      <BadgeCheck className="w-4 h-4 inline" style={{ color: "var(--color-success)" }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t font-semibold" style={{ background: "var(--color-surface-2)" }}>
                <td colSpan={5} className="px-3 py-3 text-right text-[0.78rem]" style={{ color: "var(--color-muted)" }}>showing first 30 · totals across all eligible</td>
                <td className="px-3 py-3 text-right tabular-nums">{gbp(totalAmount, { compact: true })}</td>
                <td className="px-3 py-3 text-right tabular-nums" style={{ color: "var(--color-success)" }}>{gbp(totalUplift, { compact: true })}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}
