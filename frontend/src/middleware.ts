import { NextRequest, NextResponse } from "next/server";
import appConfig from "./lib/config";
import { cookies } from "next/headers";
import fetchHelper from "./lib/fetchInstance";
import { ApiSuccessResponse, User } from "./lib/types";

const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  const res = await fetchHelper<ApiSuccessResponse<User>>("/api/auth/me");
  const isAuthenticated = res.success;
  // console.log(isAuthenticated);

  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      req.nextUrl.pathname = "/login";
      return NextResponse.redirect(req.nextUrl);
    }
  }

  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    req.nextUrl.pathname = "/dashboard";
    return NextResponse.redirect(req.nextUrl);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"], // Protect routes under /dashboard and specific routes
};

export default middleware;
