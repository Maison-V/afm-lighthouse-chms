import { PageHeader } from "@/components/shared/page-header";
import { VisitorBoard } from "@/components/visitors/visitor-board";
import { AddVisitorDialog } from "@/components/visitors/add-visitor-dialog";
import { getVisitors } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function VisitorsPage() {
  const visitors = await getVisitors();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Visitors"
        title="Guests and follow-up"
        description={
          visitors.length === 0
            ? "No visitors on record yet — register your first guest after the next service."
            : "Every first-time guest, tracked from their first visit to full integration into the family."
        }
        actions={<AddVisitorDialog />}
      />
      <VisitorBoard data={visitors} />
    </div>
  );
}
