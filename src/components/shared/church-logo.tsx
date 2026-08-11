import * as React from "react";
import { LighthouseMark } from "@/components/shared/lighthouse-mark";
import { cn } from "@/lib/utils";

/**
 * Renders the uploaded church logo (Settings → General) wherever the brand
 * mark appears. Falls back to the geometric lighthouse mark when no logo
 * has been uploaded yet.
 */
export function ChurchLogo({
  logoUrl,
  className,
}: {
  logoUrl?: string | null;
  className?: string;
}) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt="AFM Lighthouse Church Vryburg"
        className={cn("h-full w-full object-contain", className)}
      />
    );
  }
  return <LighthouseMark className={className} />;
}
