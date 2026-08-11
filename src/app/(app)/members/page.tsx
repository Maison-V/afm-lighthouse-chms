import { PageHeader } from "@/components/shared/page-header";
import { MembersTable } from "@/components/members/members-table";
import { AddMemberDialog } from "@/components/members/add-member-dialog";
import { getMembers, getMinistries } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const [members, ministries] = await Promise.all([getMembers(), getMinistries()]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Members"
        title="The congregation register"
        description={
          members.length === 0
            ? "No members yet — add the first member to start the register."
            : `${members.length} member${members.length === 1 ? "" : "s"} across every ministry — search, filter, and step into any profile.`
        }
        actions={<AddMemberDialog ministries={ministries} />}
      />
      <MembersTable data={members} />
    </div>
  );
}
