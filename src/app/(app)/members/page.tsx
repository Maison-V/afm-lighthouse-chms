import { PageHeader } from "@/components/shared/page-header";
import { MembersTable } from "@/components/members/members-table";
import { AddMemberDialog } from "@/components/members/add-member-dialog";
import { members } from "@/lib/mock-data";

export default function MembersPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Members"
        title="The congregation register"
        description={`${members.length} members across every ministry — search, filter, and step into any profile.`}
        actions={<AddMemberDialog />}
      />
      <MembersTable data={members} />
    </div>
  );
}
