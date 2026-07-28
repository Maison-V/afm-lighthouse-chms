import { UserPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { VisitorBoard } from "@/components/visitors/visitor-board";
import { visitors } from "@/lib/mock-data";

export default function VisitorsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Visitors"
        title="Guests and follow-up"
        description="Every first-time guest, tracked from their first visit to full integration into the family."
        actions={
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" /> Register visitor
          </Button>
        }
      />
      <VisitorBoard data={visitors} />
    </div>
  );
}
