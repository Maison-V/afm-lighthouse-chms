import type {
  Announcement,
  AnnouncementCategory,
  AttendanceRecord,
  BrandColors,
  Certificate,
  ChurchEvent,
  ChurchSettings,
  EventCategory,
  Member,
  MembershipStatus,
  Ministry,
  NotificationPrefs,
  Profile,
  UserSettings,
  Visitor,
  FollowUpStatus,
  VolunteerStatus,
} from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// ---------------------------------------------------------------------------
// Announcements
// ---------------------------------------------------------------------------

interface AnnouncementRow {
  id: string;
  title: string;
  body: string;
  category: AnnouncementCategory;
  starts_at: string;
  ends_at: string | null;
  published: boolean;
}

export function mapAnnouncement(row: AnnouncementRow): Announcement {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    category: row.category,
    startsAt: row.starts_at,
    endsAt: row.ends_at ?? undefined,
    published: row.published,
  };
}

/**
 * Published announcements for the public site and member view.
 */
export async function getPublishedAnnouncements(): Promise<Announcement[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("id, title, body, category, starts_at, ends_at, published")
    .eq("published", true)
    .order("starts_at", { ascending: false });

  return (data ?? []).map(mapAnnouncement);
}

/**
 * All announcements (including unpublished) for the admin manager.
 */
export async function getAllAnnouncements(): Promise<Announcement[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("id, title, body, category, starts_at, ends_at, published")
    .order("starts_at", { ascending: false });

  return (data ?? []).map(mapAnnouncement);
}

// ---------------------------------------------------------------------------
// Members
// ---------------------------------------------------------------------------

interface MemberRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  status: MembershipStatus;
  joined_at: string;
  birthday: string | null;
  address: string | null;
  ministries: string[];
  volunteer_status: VolunteerStatus;
  family: { name: string; relation: string }[];
  children: { name: string; age: number }[];
  attendance_rate: number;
  notes: { id: string; author: string; date: string; content: string }[];
  documents: { id: string; name: string; type: string; date: string }[];
  timeline: { id: string; date: string; label: string; description: string }[];
}

export function mapMember(row: MemberRow): Member {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email ?? "",
    phone: row.phone ?? "",
    status: row.status,
    joinedAt: row.joined_at,
    birthday: row.birthday ?? "",
    address: row.address ?? "",
    ministries: row.ministries ?? [],
    volunteerStatus: row.volunteer_status,
    family: row.family ?? [],
    children: row.children ?? [],
    attendanceRate: row.attendance_rate ?? 0,
    notes: row.notes ?? [],
    documents: row.documents ?? [],
    timeline: row.timeline ?? [],
  };
}

const MEMBER_SELECT =
  "id, first_name, last_name, email, phone, status, joined_at, birthday, address, ministries, volunteer_status, family, children, attendance_rate, notes, documents, timeline";

export async function getMembers(): Promise<Member[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("members")
    .select(MEMBER_SELECT)
    .order("joined_at", { ascending: false });

  return (data ?? []).map(mapMember);
}

/**
 * Household stats for a member: how many spouses and children are recorded
 * with their names filled in. Unnamed/blank entries are ignored.
 */
export function memberFamilyStats(member: Member): { spouse: number; children: number } {
  const spouse = member.family.filter(
    (f) => f.name.trim() && /spouse|wife|husband/i.test(f.relation)
  ).length;
  const children = member.children.filter((c) => c.name.trim()).length;
  return { spouse, children };
}

/**
 * Total church family: every registered member, plus their recorded spouses
 * and children (only entries whose fields are filled in).
 */
export function countChurchFamily(members: Member[]): number {
  return members.reduce((total, m) => {
    const { spouse, children } = memberFamilyStats(m);
    return total + 1 + spouse + children;
  }, 0);
}

export async function getMemberById(id: string): Promise<Member | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("members")
    .select(MEMBER_SELECT)
    .eq("id", id)
    .maybeSingle<MemberRow>();

  return data ? mapMember(data) : null;
}

// ---------------------------------------------------------------------------
// Visitors
// ---------------------------------------------------------------------------

interface VisitorRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  first_visit: string;
  source: string | null;
  assigned_to: string | null;
  follow_up_status: FollowUpStatus;
  visits: number;
  prayer_request: string | null;
  notes: string;
}

export function mapVisitor(row: VisitorRow): Visitor {
  return {
    id: row.id,
    name: row.name,
    email: row.email ?? "",
    phone: row.phone ?? "",
    firstVisit: row.first_visit,
    source: row.source ?? "",
    assignedTo: row.assigned_to ?? "",
    followUpStatus: row.follow_up_status,
    visits: row.visits ?? 1,
    prayerRequest: row.prayer_request ?? undefined,
    notes: row.notes ?? "",
  };
}

export async function getVisitors(): Promise<Visitor[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("visitors")
    .select("id, name, email, phone, first_visit, source, assigned_to, follow_up_status, visits, prayer_request, notes")
    .order("first_visit", { ascending: false });

  return (data ?? []).map(mapVisitor);
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

interface EventRow {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  capacity: number;
  check_in_enabled: boolean;
  description: string;
}

export function mapEvent(row: EventRow, registered: number): ChurchEvent {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    date: row.date,
    time: row.time,
    location: row.location,
    registered,
    capacity: row.capacity,
    checkInEnabled: row.check_in_enabled,
    description: row.description,
  };
}

const EVENT_SELECT =
  "id, title, category, date, time, location, capacity, check_in_enabled, description";

async function countRegistrations(supabase: Awaited<ReturnType<typeof createClient>>, ids: string[]): Promise<Record<string, number>> {
  if (ids.length === 0) return {};
  const { data } = await supabase
    .from("event_registrations")
    .select("event_id")
    .in("event_id", ids);
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.event_id] = (counts[row.event_id] ?? 0) + 1;
  }
  return counts;
}

export async function getEvents(): Promise<ChurchEvent[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .order("date", { ascending: true });

  const rows = (data ?? []) as EventRow[];
  const counts = await countRegistrations(supabase, rows.map((r) => r.id));
  return rows.map((row) => mapEvent(row, counts[row.id] ?? 0));
}

export async function getEventRegistrations(eventId: string): Promise<{ id: string; name: string; email: string | null; phone: string | null; created_at: string }[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("event_registrations")
    .select("id, name, email, phone, created_at")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  return (data ?? []) as { id: string; name: string; email: string | null; phone: string | null; created_at: string }[];
}

// ---------------------------------------------------------------------------
// Ministries
// ---------------------------------------------------------------------------

interface MinistryRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  leader: string | null;
  member_count: number;
  color: string;
  meeting_schedule: string | null;
  upcoming_event: string | null;
}

export function mapMinistry(row: MinistryRow): Ministry {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    leader: row.leader ?? "",
    memberCount: row.member_count,
    color: row.color,
    meetingSchedule: row.meeting_schedule ?? "",
    upcomingEvent: row.upcoming_event ?? undefined,
  };
}

const MINISTRY_SELECT =
  "id, slug, name, description, leader, member_count, color, meeting_schedule, upcoming_event";

export async function getMinistries(): Promise<Ministry[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("ministries")
    .select(MINISTRY_SELECT)
    .order("name", { ascending: true });

  return (data ?? []).map(mapMinistry);
}

export async function getMinistryBySlug(slug: string): Promise<Ministry | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("ministries")
    .select(MINISTRY_SELECT)
    .eq("slug", slug)
    .maybeSingle<MinistryRow>();

  return data ? mapMinistry(data) : null;
}

// ---------------------------------------------------------------------------
// Attendance
// ---------------------------------------------------------------------------

interface AttendanceRow {
  id: string;
  date: string;
  service: string;
  men: number;
  women: number;
  children: number;
  visitors: number;
  total: number;
}

export function mapAttendance(row: AttendanceRow): AttendanceRecord {
  return {
    id: row.id,
    date: row.date,
    service: row.service,
    men: row.men,
    women: row.women,
    children: row.children,
    visitors: row.visitors,
    total: row.total,
  };
}

export async function getAttendance(): Promise<AttendanceRecord[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("attendance")
    .select("id, date, service, men, women, children, visitors, total")
    .order("date", { ascending: true });

  return (data ?? []).map(mapAttendance);
}

// ---------------------------------------------------------------------------
// Certificates
// ---------------------------------------------------------------------------

interface CertificateRow {
  id: string;
  type: Certificate["type"];
  recipient: string;
  date_issued: string;
  issued_by: string | null;
  status: "issued" | "draft";
}

export function mapCertificate(row: CertificateRow): Certificate {
  return {
    id: row.id,
    type: row.type,
    recipient: row.recipient,
    dateIssued: row.date_issued,
    issuedBy: row.issued_by ?? "",
    status: row.status,
  };
}

export async function getCertificates(): Promise<Certificate[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("certificates")
    .select("id, type, recipient, date_issued, issued_by, status")
    .order("date_issued", { ascending: false });

  return (data ?? []).map(mapCertificate);
}

export async function getChurchSettings(): Promise<ChurchSettings> {
  const defaults: ChurchSettings = {
    churchName: "AFM Lighthouse Church Vryburg",
    denomination: "Apostolic Faith Mission",
    address: "Church Street, Vryburg, North West",
    phone: "+27 53 927 0000",
    email: "office@afmlighthouse.church",
    seniorPastor: "Pastor Kabelo Sithole",
    brandColors: { primary: "#123E73", secondary: "#2D6ECF", gold: "#C9A227" },
  };
  if (!isSupabaseConfigured()) return defaults;

  const supabase = await createClient();
  const { data } = await supabase
    .from("church_settings")
    .select("church_name, denomination, address, phone, email, senior_pastor, logo_url, brand_colors")
    .eq("id", 1)
    .maybeSingle();

  if (!data) return defaults;

  return {
    churchName: data.church_name || defaults.churchName,
    denomination: data.denomination || defaults.denomination,
    address: data.address || defaults.address,
    phone: data.phone || defaults.phone,
    email: data.email || defaults.email,
    seniorPastor: data.senior_pastor || defaults.seniorPastor,
    logoUrl: data.logo_url || undefined,
    brandColors: {
      primary: (data.brand_colors as BrandColors | null)?.primary || defaults.brandColors.primary,
      secondary: (data.brand_colors as BrandColors | null)?.secondary || defaults.brandColors.secondary,
      gold: (data.brand_colors as BrandColors | null)?.gold || defaults.brandColors.gold,
    },
  };
}

export async function getUserSettings(userId: string): Promise<UserSettings> {
  if (!isSupabaseConfigured()) return { notifications: {} };

  const supabase = await createClient();
  const { data } = await supabase
    .from("user_settings")
    .select("notifications")
    .eq("user_id", userId)
    .maybeSingle<{ notifications: NotificationPrefs | null }>();

  return { notifications: data?.notifications ?? {} };
}

export async function getAllProfiles(): Promise<Profile[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, status, created_at")
    .order("created_at", { ascending: false });

  return (data ?? []).map((row: ProfileRow) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email ?? undefined,
    role: row.role,
    status: row.status,
    createdAt: row.created_at ?? undefined,
  }));
}

interface ProfileRow {
  id: string;
  full_name: string;
  email: string | null;
  role: "admin" | "member";
  status: "approved" | "pending" | "rejected";
  created_at: string | null;
}

export async function getPendingAdmins(): Promise<Profile[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, status, created_at")
    .eq("role", "admin")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (data ?? []).map((row: ProfileRow) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email ?? undefined,
    role: row.role,
    status: row.status,
    createdAt: row.created_at ?? undefined,
  }));
}
