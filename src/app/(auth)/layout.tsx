import Link from "next/link";
import { LighthouseMark } from "@/components/shared/lighthouse-mark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-sidebar px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(45,110,207,0.18),transparent_55%)]" />
      <div className="relative flex w-full max-w-md flex-col gap-8">
        <Link href="/" className="mx-auto flex flex-col items-center gap-3">
          <div className="h-14 w-14">
            <LighthouseMark />
          </div>
          <div className="text-center">
            <p className="font-heading text-xl font-semibold tracking-wide text-white">
              AFM Lighthouse
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
              Church · Vryburg
            </p>
          </div>
        </Link>
        {children}
      </div>
    </div>
  );
}