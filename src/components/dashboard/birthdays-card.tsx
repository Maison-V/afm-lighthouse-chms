import { Cake } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import type { Member } from "@/lib/types";
import { formatBirthday, initials } from "@/lib/utils";

export function BirthdaysCard({ members }: { members: Member[] }) {
  const birthdays = members.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Birthdays this month</CardTitle>
        <CardDescription>Celebrate the family — {members.length} this month</CardDescription>
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
            {birthdays.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{initials(`${member.firstName} ${member.lastName}`)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatBirthday(member.birthday)}</p>
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
