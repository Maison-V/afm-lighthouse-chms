import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The AFM Lighthouse brand mark — a minimal geometric lighthouse silhouette
 * with a single gold beam. Used sparingly: sidebar header, auth screens,
 * certificate letterhead. Never used decoratively in page bodies.
 */
export function LighthouseMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="20" fill="hsl(216 55% 10%)" />
      <path
        d="M20 6 L16.5 30 L23.5 30 Z"
        fill="hsl(0 0% 100%)"
        opacity="0.95"
      />
      <rect x="17.4" y="12.5" width="5.2" height="2.1" fill="hsl(216 55% 10%)" />
      <rect x="16.6" y="18.5" width="6.8" height="2.1" fill="hsl(216 55% 10%)" />
      <rect x="15.8" y="24.5" width="8.4" height="2.1" fill="hsl(216 55% 10%)" />
      <path d="M14.5 33 L25.5 33 L27 36 L13 36 Z" fill="hsl(216 55% 10%)" opacity="0.9" />
      <circle cx="20" cy="8.2" r="2.6" fill="hsl(46 68% 55%)" />
      <path
        d="M20 8.2 L34 3 L21.6 11.4 Z"
        fill="hsl(46 68% 55%)"
        opacity="0.55"
      />
    </svg>
  );
}
