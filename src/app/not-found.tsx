import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LighthouseMark } from "@/components/shared/lighthouse-mark";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <div className="h-16 w-16">
        <LighthouseMark />
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="font-heading text-5xl font-semibold text-primary">404</p>
        <h1 className="font-subheading text-xl font-semibold text-foreground">This page has drifted off course</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist, or may have moved. Let&apos;s guide you back.
        </p>
      </div>
      <Button asChild className="gap-2">
        <Link href="/dashboard">
          <Compass className="h-4 w-4" /> Back to dashboard
        </Link>
      </Button>
    </div>
  );
}
