import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "ZAR") {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...opts,
  }).format(d);
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

/**
 * Birthday is stored either as "MM-DD" (manual entry) or "YYYY-MM-DD"
 * (Google Form import). Returns the "MM" month portion for either form.
 */
export function birthdayMonth(birthday: string): string {
  const m = /^(\d{2})-/.exec(birthday);
  if (m) return m[1];
  const full = /^(\d{4})-(\d{2})-/.exec(birthday);
  return full ? full[2] : "";
}

/** Human label like "14 March" from either birthday format. */
export function formatBirthday(birthday: string): string {
  if (!birthday) return "Birthday not set";
  const full = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthday);
  const short = /^(\d{2})-(\d{2})$/.exec(birthday);
  const year = full ? Number(full[1]) : 2026;
  const month = full ? Number(full[2]) - 1 : short ? Number(short[1]) - 1 : NaN;
  const day = full ? Number(full[3]) : short ? Number(short[2]) : NaN;
  if (Number.isNaN(month) || Number.isNaN(day)) return birthday;
  return new Date(year, month, day).toLocaleDateString("en-ZA", { month: "long", day: "numeric" });
}
