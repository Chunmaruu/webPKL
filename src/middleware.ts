import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const protectedRoutes = ["/dashboard", "/editor", "/templates", "/preview", "/download"];
const publicRoutes = ["/login", "/register", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isAdminRoute = path.startsWith("/admin") && path !== "/admin/login";
  const isAdminLoginPage = path === "/admin/login";
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);
  const isSuperAdmin = session?.role === "SUPER_ADMIN" || session?.email === "admin@desaweb.id";

  // Dedicated Admin Master Login Page handling
  if (isAdminLoginPage) {
    if (session && isSuperAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
    }
    return NextResponse.next();
  }

  // Admin Master protected routes handling (/admin/dashboard, /admin/templates, etc.)
  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
    }
    if (!isSuperAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  }

  // Regular village protected routes handling (/dashboard, /editor, etc.)
  if (isProtectedRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    if (isSuperAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
    }
  }

  // Auth pages redirect for logged in users
  if (isPublicRoute && session && (path === "/login" || path === "/register")) {
    if (isSuperAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
    }
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|uploads|generated).*)",
  ],
};
