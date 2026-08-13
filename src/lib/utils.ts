import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { BirthdayEntry, Member } from "@/lib/types";

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

/**
 * Every birthday this month across the church family: members, their
 * recorded spouses, and their children (only entries with a birth date).
 */
export function monthBirthdays(members: Member[], month: string): BirthdayEntry[] {
  const entries: BirthdayEntry[] = [];

  for (const m of members) {
    if (birthdayMonth(m.birthday) === month) {
      entries.push({
        id: `member-${m.id}`,
        name: `${m.firstName} ${m.lastName}`.trim(),
        label: "member",
        memberFirstName: m.firstName,
        memberLastName: m.lastName,
        birthday: m.birthday,
      });
    }

    m.family.forEach((f, i) => {
      if (!f.birthday || birthdayMonth(f.birthday) !== month) return;
      entries.push({
        id: `spouse-${m.id}-${i}`,
        name: f.name,
        label: "spouse",
        memberFirstName: m.firstName,
        memberLastName: m.lastName,
        birthday: f.birthday,
      });
    });

    m.children.forEach((c, i) => {
      if (!c.birthday || birthdayMonth(c.birthday) !== month) return;
      entries.push({
        id: `child-${m.id}-${i}`,
        name: c.name,
        label: "child",
        memberFirstName: m.firstName,
        memberLastName: m.lastName,
        birthday: c.birthday,
      });
    });
  }

  entries.sort((a, b) => birthdayDay(a.birthday) - birthdayDay(b.birthday));
  return entries;
}

/** Day-of-month ("DD") portion of either birthday format, for sorting. */
function birthdayDay(birthday: string): number {
  const m = /(\d{2})$/.exec(birthday);
  return m ? Number(m[1]) : 0;
}
