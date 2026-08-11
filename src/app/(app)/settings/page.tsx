import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminApprovalsCard } from "@/components/settings/admin-approvals-card";
import { ChurchDetailsForm } from "@/components/settings/church-details-form";
import { UsersRolesCard } from "@/components/settings/users-roles-card";
import { BrandingForm } from "@/components/settings/branding-form";
import { NotificationsForm } from "@/components/settings/notifications-form";
import { getChurchSettings, getUserSettings, getAllProfiles, getPendingAdmins } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [churchSettings, profiles, currentUser] = await Promise.all([
    getChurchSettings(),
    getAllProfiles(),
    getCurrentUser(),
  ]);

  const userSettings = currentUser ? await getUserSettings(currentUser.id) : { notifications: {} };
  const pendingAdmins = await getPendingAdmins();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Settings"
        title="Church and account setup"
        description="Manage church details, users, permissions, branding, and notifications."
      />

      <Tabs defaultValue="general">
        <TabsList className="flex-wrap">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="approvals">Admin Approvals{pendingAdmins.length > 0 && ` (${pendingAdmins.length})`}</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <ChurchDetailsForm settings={churchSettings} />
        </TabsContent>

        <TabsContent value="users">
          <UsersRolesCard profiles={profiles} currentUserId={currentUser?.id ?? ""} />
        </TabsContent>

        <TabsContent value="approvals">
          <AdminApprovalsCard pending={pendingAdmins} live />
        </TabsContent>

        <TabsContent value="branding">
          <BrandingForm initial={churchSettings.brandColors} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsForm initial={userSettings.notifications} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function getCurrentUser() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return { id: user.id };
}
