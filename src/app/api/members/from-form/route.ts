import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

/**
 * Ingestion endpoint for Google Sheets (via Apps Script onFormSubmit).
 *
 * The Google Form field names arrive as keys in `payload` — see
 * docs/google-form-members.md for the mapping and the Apps Script to use.
 *
 * Auth: header `x-import-secret` must match MEMBER_IMPORT_SECRET.
 */

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toDate(value: string): string {
  // Apps Script may send "12 May 2025", "05/12/2025" or "2025-05-12"
  const cleaned = clean(value);
  if (!cleaned) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return cleaned;
  const parsed = new Date(cleaned);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

function computeAge(dob: string): number | null {
  const date = toDate(dob);
  if (!date) return null;
  const birth = new Date(`${date}T00:00:00`);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age;
}

interface FormRow {
  name?: string;
  surname?: string;
  dateOfBirth?: string;
  residentialAddress?: string;
  cellNumber?: string;
  whatsappNumber?: string;
  maritalStatus?: string;
  spouseName?: string;
  spouseSurname?: string;
  spouseCellNumber?: string;
  spouseWhatsAppNumber?: string;
  spouseEmailAddress?: string;
  children?: { name: string; dateOfBirth: string }[];
  servingMinistry?: string;
  volunteerMinistry?: string;
  dateSigned?: string;
  popiaConsent?: string;
  photoConsent?: string;
}

function normalizePayload(raw: Record<string, unknown>): FormRow {
  const children: FormRow["children"] = [];
  for (let i = 1; i <= 4; i += 1) {
    const name = clean(raw[`child${i}Name`]);
    if (!name) continue;
    children.push({ name, dateOfBirth: toDate(clean(raw[`child${i}DateOfBirth`])) });
  }

  return {
    name: clean(raw.name),
    surname: clean(raw.surname),
    dateOfBirth: toDate(clean(raw.dateOfBirth)),
    residentialAddress: clean(raw.residentialAddress),
    cellNumber: clean(raw.cellNumber),
    whatsappNumber: clean(raw.whatsappNumber),
    maritalStatus: clean(raw.maritalStatus),
    spouseName: clean(raw.spouseName),
    spouseSurname: clean(raw.spouseSurname),
    spouseCellNumber: clean(raw.spouseCellNumber),
    spouseWhatsAppNumber: clean(raw.spouseWhatsAppNumber),
    spouseEmailAddress: clean(raw.spouseEmailAddress),
    children,
    servingMinistry: clean(raw.servingMinistry),
    volunteerMinistry: clean(raw.volunteerMinistry),
    dateSigned: toDate(clean(raw.dateSigned)),
    popiaConsent: clean(raw.popiaConsent),
    photoConsent: clean(raw.photoConsent),
  };
}

export async function POST(request: Request) {
  const secret = request.headers.get("x-import-secret");
  if (!process.env.MEMBER_IMPORT_SECRET || secret !== process.env.MEMBER_IMPORT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let raw: Record<string, unknown>;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const row = normalizePayload(raw);

  if (!row.name || !row.surname) {
    return NextResponse.json({ error: "Name and surname are required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const family = [];
  if (row.spouseName) {
    family.push({
      name: `${row.spouseName} ${row.spouseSurname ?? ""}`.trim(),
      relation: "Spouse",
      email: row.spouseEmailAddress || undefined,
      phone: row.spouseCellNumber || row.spouseWhatsAppNumber || undefined,
    });
  }
  const children = (row.children ?? []).map((c) => ({
    name: c.name,
    age: computeAge(c.dateOfBirth) ?? 0,
  }));

  const ministries = row.servingMinistry ? [row.servingMinistry] : [];

  const notes = [];
  if (row.popiaConsent) {
    notes.push({ author: "Member form", date: new Date().toISOString().slice(0, 10), content: `POPIA consent: ${row.popiaConsent}` });
  }
  if (row.photoConsent) {
    notes.push({ author: "Member form", date: new Date().toISOString().slice(0, 10), content: `Photo/media consent: ${row.photoConsent}` });
  }

  const record = {
    first_name: row.name,
    last_name: row.surname,
    email: null,
    phone: row.cellNumber || row.whatsappNumber || null,
    status: "new",
    joined_at: row.dateSigned || new Date().toISOString().slice(0, 10),
    birthday: row.dateOfBirth || null,
    address: row.residentialAddress || null,
    ministries,
    volunteer_status: row.volunteerMinistry ? "volunteer" : "none",
    family,
    children,
    notes,
    marital_status: row.maritalStatus || null,
    whatsapp: row.whatsappNumber || null,
  };

  // Upsert: match an existing member by cell number, otherwise insert.
  let memberId: string | null = null;
  let isUpdate = false;
  if (record.phone) {
    const { data: existing } = await supabase
      .from("members")
      .select("id")
      .eq("phone", record.phone)
      .maybeSingle();
    if (existing) {
      memberId = existing.id;
      isUpdate = true;
    }
  }

  let error = null;
  if (memberId) {
    ({ error } = await supabase
      .from("members")
      .update({ ...record, updated_at: new Date().toISOString() })
      .eq("id", memberId));
  } else {
    const { data, error: insertError } = await supabase.from("members").insert(record).select("id").single();
    error = insertError;
    memberId = data?.id ?? null;
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/members");
  revalidatePath("/dashboard");

  return NextResponse.json({ ok: true, memberId, updated: isUpdate });
}
