import { Topbar } from "@/components/shell/topbar";
import { Ring } from "@/components/ring";
import { campaigns, donorStats, getDonor, gifts } from "@/lib/data";
import { tierColour, tierLabel } from "@/lib/engagement";
import { gbp, initials, relativeDays } from "@/lib/utils";
import { BadgeCheck, Mail, Phone, MapPin, Plus, MessageSquareHeart, Sparkles, AlertTriangle, HandCoins } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function DonorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = getDonor(id);
  if (!d) notFound();
  const s = donorStats(id);
  const myGifts = gifts.filter((g) => g.donorId === id);

  return (
    <>
      <Topbar crumbs={["donors", `${d.firstName} ${d.lastName}`]} />
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main */}
          <div className="col-span-8 space-y-5">
            {/* Identity card */}
            <div className="card p-6">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-[1.1rem] font-semibold shrink-0"
                  style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)" }}>
                  {initials(`${d.firstName} ${d.lastName}`)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-serif text-[1.7rem] leading-tight">{d.firstName} {d.lastName}</h1>
                    <span className="pill" style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)", borderColor: "transparent" }}>
                      {d.tier === "patron" ? "patron" : d.tier === "small_change" ? "small change" : "supporter"}
                    </span>
                    {d.giftAidOnFile && (
                      <span className="pill" style={{ color: "var(--color-success)" }}>
                        <BadgeCheck className="w-3 h-3" />gift aid
                      </span>
                    )}
                    {d.isConvert && (
                      <span className="pill">convert</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-[0.825rem]" style={{ color: "var(--color-muted)" }}>
                    <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{d.email}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{d.city}, {d.postcode}</span>
                    <span>joined {relativeDays(d.joinedAt)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {d.tags.map((t) => <span key={t} className="pill text-[0.65rem]">{t}</span>)}
                  </div>
                </div>
                <Ring value={s.score} size={84} stroke={7} colour={tierColour[s.tier]} label={`${s.score}`} />
              </div>

              {/* Giving summary */}
              <div className="grid grid-cols-4 gap-4 mt-6 pt-5 border-t">
                <Metric label="lifetime" value={gbp(s.total)} />
                <Metric label="gifts" value={s.count.toString()} />
                <Metric label="avg gift" value={gbp(s.avg)} />
                <Metric label="engagement" value={tierLabel[s.tier]} colour={tierColour[s.tier]} />
              </div>
            </div>

            {/* AI summary */}
            <div className="card p-5" style={{ background: "linear-gradient(135deg, var(--color-accent-soft), var(--color-surface) 60%)" }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: "var(--color-surface)", color: "var(--color-accent)" }}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="kicker">briefing · ai summary</div>
                  <h3 className="font-serif text-[1.05rem] mt-0.5 mb-2">in 5 seconds</h3>
                  <ul className="space-y-1.5 text-[0.875rem] leading-relaxed">
                    <li>· {d.isConvert ? "convert" : "long-time supporter"} from {d.city}; {d.tier === "patron" ? "joined the Patron Circle" : d.tier === "small_change" ? "monthly Small Change donor" : "occasional one-off giver"}.</li>
                    <li>· {s.count} gifts totalling {gbp(s.total)} since {s.firstGift ? new Date(s.firstGift).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "—"}; {s.lastGift && (Date.now() - +new Date(s.lastGift)) / 86400000 < 30 ? "active right now" : "needs a warm check-in"}.</li>
                    <li>· suggested next: send a personal thank-you mentioning the {campaigns[0].name} milestone and ask how they found the last workshop.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="card">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <div>
                  <div className="kicker">timeline</div>
                  <h3 className="font-serif text-lg mt-0.5">giving & touch points</h3>
                </div>
                <div className="flex gap-1">
                  <button className="pill" style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)", borderColor: "transparent" }}>all</button>
                  <button className="pill">gifts</button>
                  <button className="pill">comms</button>
                </div>
              </div>
              <div className="px-5 py-3 relative">
                <div className="absolute top-4 bottom-4 left-7 w-px" style={{ background: "var(--color-border)" }} />
                {myGifts.slice(0, 12).map((g, i) => {
                  const c = campaigns.find((x) => x.id === g.campaignId);
                  return (
                    <div key={g.id} className="flex gap-4 py-3 relative">
                      <div className="w-5 h-5 rounded-full mt-1 flex items-center justify-center shrink-0 z-10" style={{ background: "var(--color-surface)", border: "2px solid var(--color-primary)" }}>
                        <HandCoins className="w-2.5 h-2.5" style={{ color: "var(--color-primary)" }} />
                      </div>
                      <div className="flex-1 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-[0.875rem]">
                            <span className="font-semibold">{gbp(g.amount)}</span>
                            {" "}to <span style={{ color: "var(--color-primary)" }}>{c?.name}</span>
                            {g.zakahFlag && <span className="pill ml-2" style={{ color: "var(--color-danger)" }}><AlertTriangle className="w-3 h-3" />zakah</span>}
                          </div>
                          <div className="text-[0.72rem] mt-0.5" style={{ color: "var(--color-muted)" }}>
                            via {g.method.replace("_", " ")} · {new Date(g.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            {g.giftAidEligible && " · gift aid eligible"}
                          </div>
                        </div>
                        {g.giftAidClaimed && <span className="pill text-[0.65rem]" style={{ color: "var(--color-success)" }}>claimed</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right rail */}
          <div className="col-span-4 space-y-4">
            <div className="card p-5">
              <div className="kicker mb-2">quick actions</div>
              <div className="space-y-2">
                <button className="btn btn-primary w-full justify-center"><MessageSquareHeart className="w-3.5 h-3.5" />send thank-you</button>
                <button className="btn w-full justify-center"><Plus className="w-3.5 h-3.5" />log communication</button>
                <button className="btn w-full justify-center"><HandCoins className="w-3.5 h-3.5" />add gift</button>
              </div>
            </div>

            <div className="card p-5">
              <div className="kicker">gift aid</div>
              {d.giftAidOnFile ? (
                <>
                  <div className="font-serif text-[1.05rem] mt-1 inline-flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4" style={{ color: "var(--color-success)" }} />
                    declaration on file
                  </div>
                  <div className="text-[0.78rem] mt-1" style={{ color: "var(--color-muted)" }}>
                    signed online · enduring
                  </div>
                  <div className="mt-3 pt-3 border-t flex justify-between text-[0.825rem]">
                    <span style={{ color: "var(--color-muted)" }}>uplift this year</span>
                    <span className="font-semibold">{gbp(Math.round(s.total * 0.25))}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[0.875rem] mt-1">no declaration on file.</div>
                  <button className="btn btn-primary mt-2 w-full justify-center text-[0.75rem]">request declaration</button>
                </>
              )}
            </div>

            <div className="card p-5">
              <div className="kicker">restricted fund interests</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {Array.from(new Set(myGifts.map((g) => g.restrictedFund))).filter(Boolean).map((rf) => (
                  <span key={rf} className="pill">{rf}</span>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <div className="kicker">communication preference</div>
              <div className="text-[0.875rem] mt-1">email · welcomes whatsapp on ramadan</div>
              <div className="mt-2 pt-2 border-t text-[0.78rem]" style={{ color: "var(--color-muted)" }}>
                no auto-blasts · last contacted 12 days ago
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Metric({ label, value, colour }: { label: string; value: string; colour?: string }) {
  return (
    <div>
      <div className="kicker">{label}</div>
      <div className="font-serif text-[1.25rem] mt-0.5" style={colour ? { color: colour } : undefined}>{value}</div>
    </div>
  );
}
