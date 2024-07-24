import { NextRequest, NextResponse } from "next/server";
import fetchHelper from "./lib/fetchInstance";
import { ApiSuccessResponse, User } from "./lib/types";
import { cookies } from "next/headers";
import appConfig from "@/lib/config";
const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;
  const cookieStore = cookies();
  const cookieValue = cookieStore.get("session")?.value;
  const response = await fetch(`${appConfig.apiUrl}/api/auth/me`, {
    credentials: "include", // Ensure credentials are sent
    headers: {
      "Content-Type": "application/json",
      Cookie: "session=" + cookieValue,
    },
  });

  const isAuthenticated = response.ok;

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"], // Protect routes under /dashboard and specific routes
};

export default middleware;
