"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { campaigns, campaignColours } from "@/lib/data";

export function StackedRaisedChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
        <defs>
          {campaigns.map((c) => (
            <linearGradient key={c.slug} id={`g-${c.slug}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={campaignColours[c.slug]} stopOpacity={0.7} />
              <stop offset="100%" stopColor={campaignColours[c.slug]} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" stroke="var(--color-muted)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="var(--color-muted)" fontSize={11} tickLine={false} axisLine={false}
          tickFormatter={(v) => v >= 1000 ? `£${(v / 1000).toFixed(0)}k` : `£${v}`} />
        <Tooltip
          contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
          formatter={(v: number, name: string) => [`£${v.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`, name]}
        />
        {campaigns.map((c) => (
          <Area
            key={c.slug} type="monotone" dataKey={c.slug} stackId="1"
            stroke={campaignColours[c.slug]} strokeWidth={1.5}
            fill={`url(#g-${c.slug})`} name={c.name}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
