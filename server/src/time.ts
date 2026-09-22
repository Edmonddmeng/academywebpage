// Interviews happen on campus, so every slot is entered and shown in the school's time zone.
export const SCHOOL_TZ = "America/Los_Angeles";

const fmt = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: SCHOOL_TZ, hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(date);

/** How far the school's clock is from UTC at that instant (e.g. -7h in summer). */
function offsetMs(date: Date): number {
  const parts = fmt(date);
  const n = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  return Date.UTC(n("year"), n("month") - 1, n("day"), n("hour"), n("minute"), n("second")) - date.getTime();
}

/** "2026-07-09" + "10:30" on the school's clock → the matching UTC instant (handles daylight saving). */
export function schoolTimeToUtc(date: string, time: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const local = Date.UTC(y, m - 1, d, hh, mm);
  let utc = local;
  for (let i = 0; i < 2; i++) utc = local - offsetMs(new Date(utc));
  return new Date(utc);
}

/** e.g. "Thu, Jul 9, 2026, 10:30 AM – 11:00 AM PDT" */
export function formatSlot(startsAt: string | Date, endsAt: string | Date, locale: "en" | "zh" = "en"): string {
  const tag = locale === "zh" ? "zh-CN" : "en-US";
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const day = new Intl.DateTimeFormat(tag, { timeZone: SCHOOL_TZ, weekday: "short", year: "numeric", month: "short", day: "numeric" }).format(start);
  const time = (d: Date, zone = false) =>
    new Intl.DateTimeFormat(tag, { timeZone: SCHOOL_TZ, hour: "numeric", minute: "2-digit", ...(zone ? { timeZoneName: "short" } : {}) }).format(d);
  return `${day}, ${time(start)} – ${time(end, true)}`;
}
