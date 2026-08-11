import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  HeartHandshake,
  CalendarDays,
  Megaphone,
  Award,
  ClipboardCheck,
  BarChart3,
  Settings,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export const primaryNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, description: "Overview of church life" },
  { label: "Announcements", href: "/announcements", icon: Megaphone, description: "Church news and advertisements" },
  { label: "Members", href: "/members", icon: Users, description: "The congregation register" },
  { label: "Visitors", href: "/visitors", icon: UserPlus, description: "Guests and follow-up" },
  { label: "Ministries", href: "/ministries", icon: HeartHandshake, description: "Teams and departments" },
  { label: "Events", href: "/events", icon: CalendarDays, description: "Calendar and check-in" },
  { label: "Certificates", href: "/certificates", icon: Award, description: "Generate and issue" },
  { label: "Attendance", href: "/attendance", icon: ClipboardCheck, description: "Service records" },
  { label: "Reports", href: "/reports", icon: BarChart3, description: "Insights across the house" },
];

export const secondaryNav: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings, description: "Church and account setup" },
];
