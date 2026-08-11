"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, ArrowRight, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const registerSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["member", "admin"]),
});

type RegisterValues = z.infer<typeof registerSchema>;

const roleOptions = [
  {
    value: "member" as const,
    label: "Join as a member",
    description: "Instant access to announcements, events, and ministries.",
    icon: Users,
  },
  {
    value: "admin" as const,
    label: "Register as an admin",
    description: "Full management access — requires approval by an existing admin.",
    icon: ShieldCheck,
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "member" },
  });

  const role = watch("role");

  async function onSubmit(values: RegisterValues) {
    if (!isSupabaseConfigured()) {
      toast.error("Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local to enable registration.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: values.fullName,
          role: values.role,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Email confirmation enabled — the session is null until the link is clicked.
    if (!data.session) {
      setConfirmation(`Check ${values.email} for a confirmation link, then sign in.`);
      setLoading(false);
      return;
    }

    router.refresh();
    if (values.role === "admin") {
      router.push("/pending-approval");
    } else {
      router.push("/");
    }
  }

  if (confirmation) {
    return (
      <Card className="w-full rounded-dialog border-white/10 bg-white shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl text-foreground">Confirm your email</CardTitle>
          <CardDescription>{confirmation}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login" className="flex w-full justify-center">
            <Button variant="outline" className="w-full gap-2">
              Go to sign in <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-dialog border-white/10 bg-white shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-2xl text-foreground">Create your account</CardTitle>
        <CardDescription>
          Members get instant access. Admin requests wait for an administrator&apos;s approval.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="fullName" placeholder="Thabo Mokoena" className="pl-9" {...register("fullName")} />
            </div>
            {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" placeholder="you@afmlighthouse.church" className="pl-9" {...register("email")} />
            </div>
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="password" type="password" placeholder="At least 8 characters" className="pl-9" {...register("password")} />
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Account type</Label>
            <div className="grid gap-2">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setValue("role", option.value)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                    role === option.value
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:bg-accent"
                  )}
                >
                  <option.icon
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      role === option.value ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
            Sign in <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}