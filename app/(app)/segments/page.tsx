import { Topbar } from "@/components/shell/topbar";
import { Filter } from "lucide-react";

const seeds = [
  { name: "active monthly donors", count: 28, hint: "tier in (small_change, patron) & status = active" },
  { name: "lapsed patrons", count: 3, hint: "tier = patron & no gift in 60d" },
  { name: "first-time donors this month", count: 6, hint: "first gift date in current month" },
  { name: "donors without gift aid declaration", count: 12, hint: "gift_aid_on_file = false & total > £0" },
  { name: "ramadan-only donors", count: 19, hint: "all gifts within ramadan windows" },
  { name: "workshop attendees · never donated", count: 7, hint: "tag = workshop-attendee & total = £0" },
  { name: "vip · engagement ≥ 80", count: 11, hint: "engagement_score >= 80" },
];

export default function SegmentsPage() {
  return (
    <>
      <Topbar crumbs={["segments"]} />
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h1 className="font-serif text-[1.7rem]">segments</h1>
            <p className="text-[0.85rem] mt-0.5" style={{ color: "var(--color-muted)" }}>saved filters · run, export, tag in bulk.</p>
          </div>
          <button className="btn btn-primary"><Filter className="w-3.5 h-3.5" />new segment</button>
        </div>
        <div className="card divide-y">
          {seeds.map((s) => (
            <div key={s.name} className="px-5 py-4 flex items-center justify-between hover:bg-[var(--color-surface-2)]">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-[0.78rem] mt-0.5 font-mono" style={{ color: "var(--color-muted)" }}>{s.hint}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-serif text-[1.3rem]">{s.count}</div>
                <button className="btn text-[0.75rem]">run →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
