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
