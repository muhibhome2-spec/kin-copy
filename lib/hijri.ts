// Tiny approximate Gregorian → Hijri (Umm al-Qura approximation, ±1 day).
const months = ["Muharram","Safar","Rabi' al-Awwal","Rabi' al-Thani","Jumada al-Ula","Jumada al-Thani","Rajab","Sha'ban","Ramadan","Shawwal","Dhu al-Qi'dah","Dhu al-Hijjah"];

export function toHijri(d: Date = new Date()): { day: number; month: string; year: number; full: string } {
  const jd = Math.floor((d.getTime() / 86400000) + 2440587.5);
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  let l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  l2 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const m = Math.floor((24 * l2) / 709);
  const day = l2 - Math.floor((709 * m) / 24);
  const year = 30 * n + j - 30;
  const month = months[Math.max(0, Math.min(11, m - 1))];
  return { day, month, year, full: `${day} ${month} ${year} AH` };
}
