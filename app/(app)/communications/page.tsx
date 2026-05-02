import { Topbar } from "@/components/shell/topbar";
import { ackQueue, campaigns } from "@/lib/data";
import { gbp, initials, relativeDays } from "@/lib/utils";
import { Send, SkipForward, Mail } from "lucide-react";

export default function CommunicationsPage() {
  return (
    <>
      <Topbar crumbs={["communications"]} />
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="mb-5">
          <h1 className="font-serif text-[1.7rem]">thank-yous to write</h1>
          <p className="text-[0.85rem] mt-0.5" style={{ color: "var(--color-muted)" }}>
            {ackQueue.length} waiting · oldest 4 days · automations queue, never auto-blast.
          </p>
        </div>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-5 card divide-y overflow-hidden">
            {ackQueue.map(({ gift, donor }, i) => {
              const c = campaigns.find((x) => x.id === gift.campaignId);
              const active = i === 0;
              return (
                <div key={gift.id} className={`px-4 py-3 cursor-pointer transition-colors ${active ? "bg-[var(--color-primary-soft)]" : "hover:bg-[var(--color-surface-2)]"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-[0.7rem] font-semibold shrink-0"
                      style={{ background: "var(--color-surface)", color: "var(--color-primary)" }}>
                      {initials(`${donor.firstName} ${donor.lastName}`)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-[0.875rem] truncate">{donor.firstName} {donor.lastName}</div>
                        <div className="text-[0.7rem]" style={{ color: "var(--color-muted)" }}>{relativeDays(gift.date)}</div>
                      </div>
                      <div className="text-[0.75rem] truncate" style={{ color: "var(--color-muted)" }}>
                        {gbp(gift.amount)} · {c?.name}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Preview pane */}
          <div className="col-span-7 card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="kicker">preview · template auto-selected by amount band</div>
                <h3 className="font-serif text-lg mt-0.5">thank you for your first gift</h3>
              </div>
              <div className="flex gap-2">
                <button className="btn"><SkipForward className="w-3.5 h-3.5" />skip</button>
                <button className="btn"><Mail className="w-3.5 h-3.5" />sent by post</button>
                <button className="btn btn-primary"><Send className="w-3.5 h-3.5" />send</button>
              </div>
            </div>
            <div className="rounded-md p-5 font-serif text-[0.95rem] leading-relaxed" style={{ background: "var(--color-surface-2)" }}>
              <p>assalāmu ʿalaykum {ackQueue[0]?.donor.firstName},</p>
              <br />
              <p>thank you. your gift of <strong>{gbp(ackQueue[0]?.gift.amount ?? 0)}</strong> to <em>{campaigns.find((c) => c.id === ackQueue[0]?.gift.campaignId)?.name}</em> arrived this week — and quietly, somewhere, it begins.</p>
              <br />
              <p>at new beginnings we walk alongside new muslims and the people who love them, in homes and halls and quiet conversations. your kindness pays for the cup of tea after the shahādah, the workshop on a saturday morning, the patient ear at the end of a phone line.</p>
              <br />
              <p>may every contribution return to you, multiplied, in this life and the next.</p>
              <br />
              <p>with warmth,<br />the new beginnings team</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[0.7rem]">
              <span className="pill">{`{{first_name}}`}</span>
              <span className="pill">{`{{amount}}`}</span>
              <span className="pill">{`{{campaign_name}}`}</span>
              <span className="pill">{`{{hijri_date}}`}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
