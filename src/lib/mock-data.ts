import type {
  Announcement,
  AttendanceRecord,
  Certificate,
  ChurchEvent,
  Member,
  Ministry,
  Transaction,
  Visitor,
} from "./types";

const firstNames = [
  "Thabo", "Lerato", "Kagiso", "Naledi", "Tshepo", "Boitumelo", "Kabelo", "Refilwe",
  "Sipho", "Nomvula", "Mpho", "Palesa", "Karabo", "Dineo", "Lesedi", "Tumelo",
  "Ofentse", "Katlego", "Bontle", "Reitumetse", "Neo", "Amogelang", "Onthatile", "Tebogo",
];
const lastNames = [
  "Mokoena", "Dlamini", "Molefe", "Nkosi", "Sithole", "Radebe", "Mahlangu", "Khumalo",
  "Motsepe", "Zulu", "Ndlovu", "Mokgatle", "Serfontein", "van Wyk", "Botha", "Pretorius",
];

function pick<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}

const ministryDefs: { name: string; color: string; leader: string; schedule: string; desc: string }[] = [
  { name: "Children's Church", color: "#2D6ECF", leader: "Sis. Naledi Mokoena", schedule: "Sundays, 09:00", desc: "Nurturing the youngest members of our family in faith, play, and Scripture." },
  { name: "Youth Ministry", color: "#C9A227", leader: "Pastor Kabelo Sithole", schedule: "Fridays, 18:00", desc: "A home for teenagers and young adults to grow, question, and belong." },
  { name: "Men's Fellowship", color: "#123E73", leader: "Elder Tshepo Radebe", schedule: "1st Saturday, 07:00", desc: "Building men of character, accountability, and quiet strength." },
  { name: "Women's Ministry", color: "#DC2626", leader: "Sis. Palesa Dlamini", schedule: "Wednesdays, 10:00", desc: "Encouragement, prayer, and sisterhood across every season of life." },
  { name: "Media & Broadcast", color: "#2563EB", leader: "Bro. Kagiso Ndlovu", schedule: "Sundays, 07:30", desc: "Carrying the message beyond our walls — sound, stream, and story." },
  { name: "Worship Team", color: "#C9A227", leader: "Min. Refilwe Khumalo", schedule: "Thursdays, 18:30", desc: "Leading the congregation into worship with excellence and heart." },
  { name: "Ushering & Hospitality", color: "#16A34A", leader: "Bro. Mpho Zulu", schedule: "Sundays, 08:00", desc: "The first and last faces people see — order, warmth, welcome." },
  { name: "Intercession", color: "#123E73", leader: "Sis. Dineo Motsepe", schedule: "Tuesdays, 05:30", desc: "Standing in the gap for the church, the city, and the nations." },
  { name: "Maintenance", color: "#6B7280", leader: "Bro. Karabo Mahlangu", schedule: "As needed", desc: "Stewarding every building and asset entrusted to the house." },
  { name: "Welfare", color: "#F59E0B", leader: "Sis. Bontle Serfontein", schedule: "Monthly", desc: "Meeting practical needs with dignity — food, funds, and follow-through." },
];

export const ministries: Ministry[] = ministryDefs.map((m, i) => ({
  id: `min-${i + 1}`,
  slug: m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  name: m.name,
  description: m.desc,
  leader: m.leader,
  memberCount: 14 + ((i * 7) % 40),
  color: m.color,
  meetingSchedule: m.schedule,
  upcomingEvent: i % 3 === 0 ? "Ministry planning meeting — this Thursday" : undefined,
}));

const statuses: Member["status"][] = ["active", "active", "active", "new", "inactive", "transferred"];
const volunteerStatuses: Member["volunteerStatus"][] = ["none", "volunteer", "volunteer", "leader"];

export const members: Member[] = Array.from({ length: 48 }).map((_, i) => {
  const first = pick(firstNames, i);
  const last = pick(lastNames, i * 3 + 1);
  const status = pick(statuses, i);
  const joinYear = 2016 + (i % 9);
  const monthIdx = (i * 5) % 12;
  const month = String(monthIdx + 1).padStart(2, "0");
  const day = String(1 + (i % 27)).padStart(2, "0");
  return {
    id: `mem-${i + 1}`,
    firstName: first,
    lastName: last,
    email: `${first.toLowerCase()}.${last.toLowerCase().replace(" ", "")}@example.com`,
    phone: `+27 8${(i % 9)} ${100 + i} ${1000 + i * 7}`,
    status,
    joinedAt: `${joinYear}-${month}-${day}`,
    birthday: `${String(1 + ((i * 3) % 12)).padStart(2, "0")}-${String(1 + ((i * 11) % 27)).padStart(2, "0")}`,
    address: `${12 + i} Church Street, Vryburg`,
    ministries: [pick(ministryDefs, i).name, ...(i % 4 === 0 ? [pick(ministryDefs, i + 2).name] : [])],
    volunteerStatus: pick(volunteerStatuses, i),
    family: i % 3 === 0 ? [{ name: `${pick(firstNames, i + 4)} ${last}`, relation: "Spouse" }] : [],
    children: i % 4 === 0 ? [{ name: pick(firstNames, i + 9), age: 4 + (i % 10) }] : [],
    attendanceRate: 40 + ((i * 13) % 60),
    notes:
      i % 5 === 0
        ? [{ id: `note-${i}`, author: "Pastor Kabelo Sithole", date: `${joinYear + 1}-03-14`, content: "Followed up after hospital visit — recovering well, grateful for the prayer support." }]
        : [],
    documents:
      i % 6 === 0
        ? [{ id: `doc-${i}`, name: "Baptism Certificate.pdf", type: "Certificate", date: `${joinYear}-06-02` }]
        : [],
    timeline: [
      { id: `t1-${i}`, date: `${joinYear}-${month}-${day}`, label: "Joined the church", description: "Registered as a new member after Sunday service." },
      ...(i % 3 === 0
        ? [{ id: `t2-${i}`, date: `${joinYear + 1}-02-10`, label: "Joined a ministry", description: `Began serving with ${pick(ministryDefs, i).name}.` }]
        : []),
      ...(i % 7 === 0
        ? [{ id: `t3-${i}`, date: `${joinYear + 2}-08-01`, label: "Took on leadership", description: "Appointed as a small group leader." }]
        : []),
    ],
  };
});

const followUps: Visitor["followUpStatus"][] = ["new", "contacted", "visited", "integrated", "lost"];
const sources = ["Sunday Service", "Youth Event", "Community Outreach", "Member Invitation", "Social Media", "Crusade"];

export const visitors: Visitor[] = Array.from({ length: 20 }).map((_, i) => {
  const first = pick(firstNames, i + 6);
  const last = pick(lastNames, i * 2 + 3);
  return {
    id: `vis-${i + 1}`,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}${i}@example.com`,
    phone: `+27 7${i % 9} ${200 + i} ${3000 + i * 3}`,
    firstVisit: `2026-0${1 + (i % 7)}-${String(2 + i).padStart(2, "0")}`,
    source: pick(sources, i),
    assignedTo: pick(["Sis. Naledi Mokoena", "Pastor Kabelo Sithole", "Bro. Mpho Zulu", "Sis. Palesa Dlamini"], i),
    followUpStatus: pick(followUps, i),
    visits: 1 + (i % 5),
    prayerRequest: i % 3 === 0 ? "Praying for a new job opportunity and family health." : undefined,
    notes: i % 4 === 0 ? "Expressed interest in joining the youth ministry." : "",
  };
});

const eventDefs: { title: string; category: ChurchEvent["category"]; desc: string }[] = [
  { title: "Sunday Worship Service", category: "service", desc: "Our weekly gathering of worship, word, and community." },
  { title: "Women's Conference: Rooted", category: "conference", desc: "A two-day gathering for women to be renewed in identity and purpose." },
  { title: "Community Food Drive", category: "outreach", desc: "Distributing food parcels to families across Vryburg." },
  { title: "New Believers Class", category: "training", desc: "A four-week foundation course for those new to the faith." },
  { title: "Youth Night: Ignite", category: "social", desc: "Games, worship, and a message built for teenagers." },
  { title: "Leadership Training Intensive", category: "training", desc: "Equipping ministry leaders for the year ahead." },
  { title: "Men's Breakfast", category: "social", desc: "Fellowship and a word for the men of the house." },
  { title: "Watchnight Prayer Service", category: "service", desc: "An evening of intercession and thanksgiving." },
];

export const events: ChurchEvent[] = eventDefs.map((e, i) => ({
  id: `evt-${i + 1}`,
  title: e.title,
  category: e.category,
  date: `2026-0${(i % 9) + 1}-${String(4 + i * 2).padStart(2, "0")}`,
  time: pick(["09:00", "10:00", "18:00", "18:30", "07:00"], i),
  location: pick(["Main Auditorium", "Fellowship Hall", "Community Grounds", "Youth Center"], i),
  registered: 40 + i * 17,
  capacity: 200 + i * 20,
  checkInEnabled: i % 2 === 0,
  description: e.desc,
}));

const incomeCategories = ["Tithes", "Offering", "Building Fund", "Missions", "Special Donation"];
const expenseCategories = ["Utilities", "Salaries", "Maintenance", "Outreach", "Media Equipment", "Welfare Support"];

export const transactions: Transaction[] = Array.from({ length: 40 }).map((_, i) => {
  const isIncome = i % 5 !== 0;
  return {
    id: `txn-${i + 1}`,
    date: `2026-0${(i % 7) + 1}-${String(1 + (i % 27)).padStart(2, "0")}`,
    type: isIncome ? "income" : "expense",
    category: isIncome ? pick(incomeCategories, i) : pick(expenseCategories, i),
    description: isIncome ? "Sunday service collection" : "Monthly operating expense",
    amount: isIncome ? 1200 + i * 340 : 800 + i * 210,
    method: pick(["cash", "eft", "card", "online"], i),
    ministry: i % 4 === 0 ? pick(ministryDefs, i).name : undefined,
  };
});

export const certificates: Certificate[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `cert-${i + 1}`,
  type: pick(["baptism", "membership", "marriage", "dedication", "confirmation"], i),
  recipient: `${pick(firstNames, i + 2)} ${pick(lastNames, i + 5)}`,
  dateIssued: `2026-0${(i % 6) + 1}-${String(3 + i).padStart(2, "0")}`,
  issuedBy: "Pastor Kabelo Sithole",
  status: i % 5 === 0 ? "draft" : "issued",
}));

export const attendance: AttendanceRecord[] = Array.from({ length: 10 }).map((_, i) => {
  const men = 60 + i * 4;
  const women = 90 + i * 5;
  const children = 40 + i * 3;
  const vis = 8 + i;
  return {
    id: `att-${i + 1}`,
    date: `2026-0${(i % 6) + 1}-${String(4 + i * 3).padStart(2, "0")}`,
    service: i % 2 === 0 ? "Sunday Morning Service" : "Midweek Service",
    men,
    women,
    children,
    visitors: vis,
    total: men + women + children + vis,
  };
});

export const announcements: Announcement[] = [
  {
    id: "ann-1",
    title: "Youth Camp 2026 — registrations open",
    body: "Sign up at the welcome desk or via the church office. R150 per child, scholarships available — every young person should have their place.",
    category: "event",
    startsAt: "2026-08-02",
    published: true,
  },
  {
    id: "ann-2",
    title: "New season of Friday Night Worship",
    body: "Join us every Friday at 18:00 as the Praise and Worship ministry leads an hour of worship and intercession. All are welcome.",
    category: "service",
    startsAt: "2026-07-31",
    published: true,
  },
  {
    id: "ann-3",
    title: "Church cleaning day — everyone is asked to help",
    body: "Saturday at 08:00. Gloves, cloths, and elbow grease needed as we prepare the house for Sunday.",
    category: "notice",
    startsAt: "2026-07-26",
    published: true,
  },
  {
    id: "ann-4",
    title: "Community food drive",
    body: "Bring non-perishables to the church office during the week. We distribute to families in Vryburg every first Saturday.",
    category: "outreach",
    startsAt: "2026-07-20",
    published: true,
  },
  {
    id: "ann-5",
    title: "Men's Fellowship breakfast",
    body: "First Saturday of the month, 07:00 sharp. A time of fellowship, testimony, and discipleship over breakfast.",
    category: "social",
    startsAt: "2026-08-01",
    published: true,
  },
];

export const dashboardStats = {
  totalMembers: members.length,
  activeMembers: members.filter((m) => m.status === "active").length,
  newVisitorsThisMonth: visitors.filter((v) => v.followUpStatus === "new").length,
  upcomingEvents: events.length,
  attendanceLastSunday: attendance[attendance.length - 1]?.total ?? 0,
  offeringThisMonth: transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0),
  birthdaysThisMonth: members.filter((m) => {
    const month = Number(m.birthday.split("-")[0]);
    return month === new Date("2026-07-26").getMonth() + 1;
  }),
};
