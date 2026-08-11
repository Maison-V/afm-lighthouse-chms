import { redirect } from "next/navigation";
import { ShieldCheck, User as UserIcon, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProfileForm } from "@/components/profile/profile-form";
import { getCurrentProfile } from "@/lib/auth";
import { formatDate, initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusTone: Record<string, "success" | "warning" | "destructive" | "outline"> = {
  approved: "success",
  pending: "warning",
  rejected: "destructive",
};

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Account"
        title="My profile"
        description="Update your personal details, email, and password."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
              <Avatar className="h-20 w-20 text-lg">
                <AvatarFallback>{initials(profile.fullName || profile.email || "U") || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-subheading text-base font-semibold text-foreground">
                  {profile.fullName || "Unnamed"}
                </p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge variant={profile.role === "admin" ? "gold" : "outline"} className="gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {profile.role === "admin" ? "Administrator" : "Member"}
                </Badge>
                <Badge variant={statusTone[profile.status] ?? "outline"}>{profile.status}</Badge>
              </div>
              {profile.createdAt && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" /> Joined {formatDate(profile.createdAt)}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" /> Your account
              </CardTitle>
              <CardDescription>
                Your sign-in is linked to this email. Changing it will ask you to confirm the new
                address before it takes effect.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <ProfileForm
            fullName={profile.fullName}
            email={profile.email ?? ""}
            role={profile.role}
            status={profile.status}
          />
        </div>
      </div>
    </div>
  );
}
