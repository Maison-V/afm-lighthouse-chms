import { Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default function PendingApprovalPage() {
  return (
    <Card className="w-full rounded-dialog border-white/10 bg-white shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-2xl text-foreground">Awaiting approval</CardTitle>
        <CardDescription>
          Your admin request has been submitted. An administrator needs to approve your account
          before you can access the management system.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-5">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-gold" />
          This usually takes less than a day — you will be able to sign in once approved.
        </div>
        <SignOutButton variant="outline" />
      </CardContent>
    </Card>
  );
}