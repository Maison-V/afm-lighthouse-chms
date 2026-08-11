"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Signs the current user out and returns to /login. Safe in mock-data demo
 * mode (when Supabase is not configured) — it just navigates.
 */
export function SignOutButton({
  variant = "ghost",
  size = "sm",
  className,
  children,
}: {
  variant?: "ghost" | "outline" | "destructive";
  size?: "sm" | "default";
  className?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={async () => {
        if (isSupabaseConfigured()) {
          const supabase = createClient();
          await supabase.auth.signOut();
        }
        router.push("/login");
        router.refresh();
      }}
    >
      <LogOut className="h-4 w-4" />
      {children ?? "Log out"}
    </Button>
  );
}