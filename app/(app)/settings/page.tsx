import { Topbar } from "@/components/shell/topbar";

export default function SettingsPage() {
  return (
    <>
      <Topbar crumbs={["settings"]} />
      <div className="flex-1 overflow-auto px-8 py-6">
        <h1 className="font-serif text-[1.7rem] mb-1">settings</h1>
        <p className="text-[0.85rem] mb-5" style={{ color: "var(--color-muted)" }}>users, templates, tags, campaigns, audit log.</p>
        <div className="grid grid-cols-2 gap-4">
          {["users & roles", "email templates", "tags", "campaigns", "imports history", "audit log", "charity profile"].map((s) => (
            <div key={s} className="card p-5">
              <div className="font-serif text-[1.05rem]">{s}</div>
              <p className="text-[0.78rem] mt-1" style={{ color: "var(--color-muted)" }}>configure {s} →</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
