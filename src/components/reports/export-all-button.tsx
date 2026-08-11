"use client";

import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Member, Visitor, AttendanceRecord, ChurchEvent, Ministry, Certificate } from "@/lib/types";

function toCsv(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
}

export function ExportAllButton({
  members,
  visitors,
  attendance,
  events,
  ministries,
  certificates,
}: {
  members: Member[];
  visitors: Visitor[];
  attendance: AttendanceRecord[];
  events: ChurchEvent[];
  ministries: Ministry[];
  certificates: Certificate[];
}) {
  function download(filename: string, content: string) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function exportAll() {
    try {
      download("members.csv", toCsv(members.map((m) => ({ first_name: m.firstName, last_name: m.lastName, email: m.email, phone: m.phone, status: m.status, joined_at: m.joinedAt, birthday: m.birthday, ministries: m.ministries.join("; "), volunteer_status: m.volunteerStatus }))));
      download("visitors.csv", toCsv(visitors.map((v) => ({ name: v.name, email: v.email, phone: v.phone, first_visit: v.firstVisit, source: v.source, assigned_to: v.assignedTo, follow_up_status: v.followUpStatus, visits: v.visits, prayer_request: v.prayerRequest ?? "" }))));
      download("attendance.csv", toCsv(attendance.map((a) => ({ date: a.date, service: a.service, men: a.men, women: a.women, children: a.children, visitors: a.visitors, total: a.total }))));
      download("events.csv", toCsv(events.map((e) => ({ title: e.title, category: e.category, date: e.date, time: e.time, location: e.location, registered: e.registered, capacity: e.capacity }))));
      download("ministries.csv", toCsv(ministries.map((m) => ({ name: m.name, description: m.description, leader: m.leader, member_count: m.memberCount, meeting_schedule: m.meetingSchedule }))));
      download("certificates.csv", toCsv(certificates.map((c) => ({ type: c.type, recipient: c.recipient, date_issued: c.dateIssued, issued_by: c.issuedBy, status: c.status }))));
      toast.success("All data exported as CSV files");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    }
  }

  return (
    <Button variant="outline" className="gap-2" onClick={exportAll}>
      <Download className="h-4 w-4" /> Export all
    </Button>
  );
}
