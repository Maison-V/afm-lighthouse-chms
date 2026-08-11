import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Paths that only approved admins may open. Anything under these prefixes
 * (and /ministries/<slug>) is part of the management system.
 */
const ADMIN_PATHS = [
  "/dashboard",
  "/members",
  "/visitors",
  "/certificates",
  "/attendance",
  "/reports",
  "/settings",
  "/announcements",
];

const AUTH_PATHS = ["/login", "/register", "/pending-approval"];

function isAdminPath(pathname: string) {
  if (ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) return true;
  // /ministries itself is public, but /ministries/<slug> is the admin detail page
  return /^\/ministries\/[^/]+/.test(pathname);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Mock-data demo mode — no Supabase project configured yet, allow everything.
  if (!isSupabaseConfigured()) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not signed in: only the protected admin paths demand a session.
  if (!user) {
    if (isAdminPath(pathname)) {
      const url = new URL("/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return response;
  }

  // Signed in: resolve role + approval status from the profile.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle<{ role: "admin" | "member"; status: string }>();

  const role = profile?.role ?? "member";
  const status = profile?.status ?? "approved";

  // Pending admin: only the awaiting-approval screen (and sign-out).
  if (role === "admin" && status !== "approved") {
    if (pathname !== "/pending-approval") {
      return NextResponse.redirect(new URL("/pending-approval", request.url));
    }
    return response;
  }

  // Approved admin: everything, but never the auth/public home at "/".
  if (role === "admin" && status === "approved") {
    if (pathname === "/" || AUTH_PATHS.some((p) => pathname === p)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return response;
  }

  // Member: get the community site, not the management system.
  if (isAdminPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (AUTH_PATHS.some((p) => pathname === p)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};