import { Topbar } from "@/components/shell/topbar";
import { FileText, Download } from "lucide-react";

const reports = [
  { name: "monthly snapshot", desc: "one-pager pdf · totals, top campaigns, retention, new vs returning, gift aid status", date: "march 2026" },
  { name: "trustees pack", desc: "4-page board-ready pdf · charts, narrative, quarterly outlook", date: "q1 2026" },
  { name: "year-on-year", desc: "chart-heavy comparison across last 3 years", date: "ytd" },
  { name: "campaign deep-dive", desc: "per-campaign performance with cohort breakdowns", date: "any campaign" },
];

export default function ReportsPage() {
  return (
    <>
      <Topbar crumbs={["reports"]} />
      <div className="flex-1 overflow-auto px-8 py-6">
        <h1 className="font-serif text-[1.7rem] mb-1">reports</h1>
        <p className="text-[0.85rem] mb-5" style={{ color: "var(--color-muted)" }}>pre-built · board-ready · one click to pdf.</p>
        <div className="grid grid-cols-2 gap-4">
          {reports.map((r) => (
            <div key={r.name} className="card p-5 group hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)" }}>
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-[1.1rem]">{r.name}</h3>
                  <p className="text-[0.825rem] mt-1" style={{ color: "var(--color-muted)" }}>{r.desc}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="pill text-[0.65rem]">{r.date}</span>
                    <button className="btn text-[0.75rem]"><Download className="w-3 h-3" />download pdf</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
