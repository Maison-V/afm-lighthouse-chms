"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Guards every mutation: only approved admins may change church data.
 */
async function requireAdmin() {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured yet.");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to do this.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle<{ role: string; status: string }>();

  if (!profile || profile.role !== "admin" || profile.status !== "approved") {
    throw new Error("You need administrator access to do this.");
  }

  return supabase;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---------------------------------------------------------------------------
// Members
// ---------------------------------------------------------------------------

export async function addMember(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ministry?: string;
}) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("members").insert({
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    phone: input.phone,
    ministries: input.ministry ? [input.ministry] : [],
    timeline: [
      {
        id: crypto.randomUUID(),
        date: new Date().toISOString().slice(0, 10),
        label: "Joined the church",
        description: "Registered in the congregation register.",
      },
    ],
  });
  if (error) throw new Error(error.message);
  revalidatePath("/members");
  revalidatePath("/dashboard");
}

export async function updateMemberStatus(memberId: string, status: "active" | "new" | "inactive" | "transferred") {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("members").update({ status }).eq("id", memberId);
  if (error) throw new Error(error.message);
  revalidatePath("/members");
  revalidatePath("/dashboard");
}

export async function updateMember(
  memberId: string,
  input: {
    email: string;
    phone: string;
    address?: string;
    birthday?: string;
    volunteerStatus: "volunteer" | "leader" | "none";
    status: "active" | "new" | "inactive" | "transferred";
  }
) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("members")
    .update({
      email: input.email,
      phone: input.phone,
      address: input.address || null,
      birthday: input.birthday || null,
      volunteer_status: input.volunteerStatus,
      status: input.status,
    })
    .eq("id", memberId);
  if (error) throw new Error(error.message);
  revalidatePath(`/members/${memberId}`);
  revalidatePath("/members");
}

export async function archiveMember(memberId: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("members").update({ status: "inactive" }).eq("id", memberId);
  if (error) throw new Error(error.message);
  revalidatePath("/members");
  revalidatePath("/dashboard");
}

// ---------------------------------------------------------------------------
// Visitors
// ---------------------------------------------------------------------------

export async function addVisitor(input: {
  name: string;
  email?: string;
  phone?: string;
  source?: string;
  assignedTo?: string;
  prayerRequest?: string;
}) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("visitors").insert({
    name: input.name,
    email: input.email || null,
    phone: input.phone || null,
    source: input.source || null,
    assigned_to: input.assignedTo || null,
    prayer_request: input.prayerRequest || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/visitors");
  revalidatePath("/dashboard");
}

export async function updateVisitorStatus(visitorId: string, status: "new" | "contacted" | "visited" | "integrated" | "lost") {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("visitors").update({ follow_up_status: status }).eq("id", visitorId);
  if (error) throw new Error(error.message);
  revalidatePath("/visitors");
  revalidatePath("/dashboard");
}

export async function incrementVisitorVisits(visitorId: string) {
  const supabase = await requireAdmin();
  const { data, error } = await supabase
    .from("visitors")
    .select("visits")
    .eq("id", visitorId)
    .maybeSingle<{ visits: number }>();
  if (error || !data) throw new Error(error?.message ?? "Visitor not found.");
  const { error: updateError } = await supabase
    .from("visitors")
    .update({ visits: data.visits + 1, follow_up_status: "visited" })
    .eq("id", visitorId);
  if (updateError) throw new Error(updateError.message);
  revalidatePath("/visitors");
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export async function createEvent(input: {
  title: string;
  category: "service" | "conference" | "outreach" | "training" | "social";
  date: string;
  time: string;
  location: string;
  capacity: number;
  checkInEnabled?: boolean;
  description?: string;
}) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("events").insert({
    title: input.title,
    category: input.category,
    date: input.date,
    time: input.time,
    location: input.location,
    capacity: input.capacity,
    check_in_enabled: input.checkInEnabled ?? false,
    description: input.description ?? "",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/events");
  revalidatePath("/dashboard");
}

export async function deleteEvent(eventId: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("events").delete().eq("id", eventId);
  if (error) throw new Error(error.message);
  revalidatePath("/events");
  revalidatePath("/dashboard");
}

export async function deleteEventRegistration(registrationId: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("event_registrations").delete().eq("id", registrationId);
  if (error) throw new Error(error.message);
  revalidatePath("/events");
}

/**
 * Public registration for an event — no auth required (RLS allows anon insert).
 */
export async function registerForEvent(input: {
  eventId: string;
  name: string;
  email?: string;
  phone?: string;
}) {
  if (!isSupabaseConfigured()) throw new Error("Registration is not available yet.");

  const supabase = await createClient();
  const { error } = await supabase.from("event_registrations").insert({
    event_id: input.eventId,
    name: input.name,
    email: input.email || null,
    phone: input.phone || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/events");
}

// ---------------------------------------------------------------------------
// Ministries
// ---------------------------------------------------------------------------

export async function createMinistry(input: {
  name: string;
  description: string;
  leader?: string;
  color?: string;
  meetingSchedule?: string;
}) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("ministries").insert({
    slug: slugify(input.name),
    name: input.name,
    description: input.description,
    leader: input.leader || null,
    color: input.color || "#2D6ECF",
    meeting_schedule: input.meetingSchedule || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/ministries");
}

export async function updateMinistry(
  ministryId: string,
  input: Partial<{
    name: string;
    description: string;
    leader: string;
    color: string;
    meetingSchedule: string;
    upcomingEvent: string | null;
  }>
) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("ministries")
    .update({
      ...(input.name !== undefined && { name: input.name, slug: slugify(input.name) }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.leader !== undefined && { leader: input.leader }),
      ...(input.color !== undefined && { color: input.color }),
      ...(input.meetingSchedule !== undefined && { meeting_schedule: input.meetingSchedule }),
      ...(input.upcomingEvent !== undefined && { upcoming_event: input.upcomingEvent }),
    })
    .eq("id", ministryId);
  if (error) throw new Error(error.message);
  revalidatePath("/ministries");
}

export async function deleteMinistry(ministryId: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("ministries").delete().eq("id", ministryId);
  if (error) throw new Error(error.message);
  revalidatePath("/ministries");
}

// ---------------------------------------------------------------------------
// Attendance
// ---------------------------------------------------------------------------

export async function recordAttendance(input: {
  date: string;
  service: string;
  men: number;
  women: number;
  children: number;
  visitors: number;
}) {
  const supabase = await requireAdmin();
  const total = input.men + input.women + input.children + input.visitors;
  const { error } = await supabase.from("attendance").insert({
    date: input.date,
    service: input.service,
    men: input.men,
    women: input.women,
    children: input.children,
    visitors: input.visitors,
    total,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/attendance");
  revalidatePath("/dashboard");
}

export async function deleteAttendance(recordId: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("attendance").delete().eq("id", recordId);
  if (error) throw new Error(error.message);
  revalidatePath("/attendance");
  revalidatePath("/dashboard");
}

// ---------------------------------------------------------------------------
// Certificates
// ---------------------------------------------------------------------------

export async function issueCertificate(input: {
  type: "baptism" | "membership" | "marriage" | "dedication" | "confirmation";
  recipient: string;
  dateIssued: string;
}) {
  const supabase = await requireAdmin();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase.from("certificates").insert({
    type: input.type,
    recipient: input.recipient,
    date_issued: input.dateIssued,
    issued_by: user?.email ?? null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/certificates");
}

export async function deleteCertificate(certificateId: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("certificates").delete().eq("id", certificateId);
  if (error) throw new Error(error.message);
  revalidatePath("/certificates");
}

// ---------------------------------------------------------------------------
// Account & settings
// ---------------------------------------------------------------------------

async function requireUser() {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured yet.");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to do this.");
  return { supabase, userId: user.id, email: user.email ?? "" };
}

export async function updateOwnProfile(input: { fullName: string; email?: string; password?: string }) {
  const { supabase, userId, email: currentEmail } = await requireUser();

  const fullName = input.fullName.trim();
  if (!fullName) throw new Error("Your name cannot be empty.");

  const update: Record<string, string> = { full_name: fullName };
  const email = input.email?.trim();
  if (email && email !== currentEmail) {
    update.email = email;
  }
  if (input.password && input.password.length >= 6) {
    const { error: pwError } = await supabase.auth.updateUser({ password: input.password });
    if (pwError) throw new Error(pwError.message);
  }

  const { error } = await supabase.from("profiles").update(update).eq("id", userId);
  if (error) throw new Error(error.message);

  revalidatePath("/profile");
  revalidatePath("/dashboard");
}

export async function saveChurchDetails(input: {
  churchName: string;
  denomination: string;
  address: string;
  phone: string;
  email: string;
  seniorPastor: string;
}) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("church_settings")
    .update({
      church_name: input.churchName.trim() || "AFM Lighthouse Church Vryburg",
      denomination: input.denomination.trim(),
      address: input.address.trim(),
      phone: input.phone.trim(),
      email: input.email.trim(),
      senior_pastor: input.seniorPastor.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) throw new Error(error.message);

  revalidatePath("/settings");
  revalidatePath("/");
}

export async function uploadChurchLogo(formData: FormData) {
  const supabase = await requireAdmin();

  const file = formData.get("logo") as File | null;
  if (!file || file.size === 0) throw new Error("Choose a logo image first.");
  if (!file.type.startsWith("image/")) throw new Error("The logo must be an image file.");
  if (file.size > 2_000_000) throw new Error("The logo must be under 2 MB.");

  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;

  const { error } = await supabase
    .from("church_settings")
    .update({ logo_url: dataUrl, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) throw new Error(error.message);

  revalidatePath("/settings");
  revalidatePath("/");
}

export async function saveBrandColors(colors: { primary: string; secondary: string; gold: string }) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("church_settings")
    .update({
      brand_colors: {
        primary: colors.primary.toUpperCase(),
        secondary: colors.secondary.toUpperCase(),
        gold: colors.gold.toUpperCase(),
      },
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) throw new Error(error.message);

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/");
}

export async function updateNotificationPrefs(prefs: Record<string, boolean>) {
  const { supabase, userId } = await requireUser();
  const { error } = await supabase.from("user_settings").upsert(
    { user_id: userId, notifications: prefs, updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  );
  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}

function generateInvitePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  let password = "";
  for (const b of bytes) password += chars[b % chars.length];
  return password;
}

export async function inviteUser(input: { email: string; fullName: string; role: "admin" | "member" }) {
  const supabase = await requireAdmin();
  const admin = (await import("@/lib/supabase/admin")).createAdminClient();

  const email = input.email.trim().toLowerCase();
  const password = generateInvitePassword();

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: input.role, full_name: input.fullName.trim() },
  });
  if (error) throw new Error(error.message);

  // role=admin invites land as "pending" via the handle_new_user trigger —
  // the invited person stays locked out until approved on this page.
  revalidatePath("/settings");
  return { password, email: data.user.email ?? email };
}

export async function setUserRole(userId: string, role: "admin" | "member") {
  const supabase = await requireAdmin();
  if (role !== "admin" && role !== "member") throw new Error("Unknown role.");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (userId === user?.id) throw new Error("You cannot change your own role.");

  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}

export async function setUserStatus(userId: string, status: "approved" | "pending" | "rejected") {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("profiles").update({ status }).eq("id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}

export async function deleteUser(userId: string) {
  const supabase = await requireAdmin();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (userId === user?.id) throw new Error("You cannot delete your own account.");

  const admin = (await import("@/lib/supabase/admin")).createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}
