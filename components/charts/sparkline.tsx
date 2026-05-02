"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";

export function Sparkline({ data, colour = "var(--color-primary)" }: { data: number[]; colour?: string }) {
  const d = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={d} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`spk-${colour}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colour} stopOpacity={0.4} />
            <stop offset="100%" stopColor={colour} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={colour} strokeWidth={1.5} fill={`url(#spk-${colour})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
