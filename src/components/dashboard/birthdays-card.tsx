import { Cake } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import type { BirthdayEntry } from "@/lib/types";
import { formatBirthday, initials } from "@/lib/utils";

const labelText: Record<BirthdayEntry["label"], string> = {
  member: "Member",
  spouse: "Spouse",
  child: "Child",
};

export function BirthdaysCard({ birthdays }: { birthdays: BirthdayEntry[] }) {
  const members = birthdays.filter((b) => b.label === "member").length;
  const spouses = birthdays.filter((b) => b.label === "spouse").length;
  const children = birthdays.filter((b) => b.label === "child").length;
  const breakdown = [
    members > 0 && `${members} member${members === 1 ? "" : "s"}`,
    spouses > 0 && `${spouses} spouse${spouses === 1 ? "" : "s"}`,
    children > 0 && `${children} child${children === 1 ? "" : "ren"}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Birthdays this month</CardTitle>
        <CardDescription>
          Celebrate the family — {birthdays.length} this month
          {breakdown ? ` (${breakdown})` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {birthdays.length === 0 ? (
          <EmptyState
            icon={Cake}
            title="No birthdays this month"
            description="Check back next month, or add member birth dates to see them here."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {birthdays.map((birthday) => (
              <div key={birthday.id} className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{initials(birthday.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{birthday.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {labelText[birthday.label]}
                    {birthday.label === "member"
                      ? ""
                      : ` of ${birthday.memberFirstName} ${birthday.memberLastName}`}
                    {" · "}
                    {formatBirthday(birthday.birthday)}
                  </p>
                </div>
                <Cake className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.75} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
