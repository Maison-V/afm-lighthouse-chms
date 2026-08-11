export type UserRole = "admin" | "member";
export type ProfileStatus = "approved" | "pending" | "rejected";

export interface Profile {
  id: string;
  fullName: string;
  email?: string;
  role: UserRole;
  status: ProfileStatus;
  createdAt?: string;
}

export type AnnouncementCategory = "service" | "event" | "notice" | "outreach" | "social";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: AnnouncementCategory;
  startsAt: string;
  endsAt?: string;
  published: boolean;
}

export type MembershipStatus = "active" | "inactive" | "new" | "transferred";
export type VolunteerStatus = "volunteer" | "leader" | "none";

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  email: string;
  phone: string;
  status: MembershipStatus;
  joinedAt: string;
  birthday: string; // MM-DD
  address: string;
  ministries: string[];
  volunteerStatus: VolunteerStatus;
  family: { name: string; relation: string }[];
  children: { name: string; age: number }[];
  attendanceRate: number; // 0-100
  notes: { id: string; author: string; date: string; content: string }[];
  documents: { id: string; name: string; type: string; date: string }[];
  timeline: { id: string; date: string; label: string; description: string }[];
}

export type FollowUpStatus = "new" | "contacted" | "visited" | "integrated" | "lost";

export interface Visitor {
  id: string;
  name: string;
  email: string;
  phone: string;
  firstVisit: string;
  source: string;
  assignedTo: string;
  followUpStatus: FollowUpStatus;
  visits: number;
  prayerRequest?: string;
  notes: string;
}

export interface Ministry {
  id: string;
  slug: string;
  name: string;
  description: string;
  leader: string;
  memberCount: number;
  color: string;
  meetingSchedule: string;
  upcomingEvent?: string;
}

export type EventCategory = "service" | "conference" | "outreach" | "training" | "social";

export interface ChurchEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  registered: number;
  capacity: number;
  checkInEnabled: boolean;
  description: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  method: "cash" | "eft" | "card" | "online";
  ministry?: string;
}

export interface Certificate {
  id: string;
  type: "baptism" | "membership" | "marriage" | "dedication" | "confirmation";
  recipient: string;
  dateIssued: string;
  issuedBy: string;
  status: "draft" | "issued";
}

export interface AttendanceRecord {
  id: string;
  date: string;
  service: string;
  men: number;
  women: number;
  children: number;
  visitors: number;
  total: number;
}
