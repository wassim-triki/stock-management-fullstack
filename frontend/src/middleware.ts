import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "./api/auth"; // Make sure this function checks authentication correctly

const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  const isAuthenticated = await getAuthUser();

  // Protect routes starting with /dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      // Redirect to login if the user is not authenticated
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Protect /login and /signup routes if the user is authenticated
  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Continue if the path is not protected or the user is correctly authenticated
  return NextResponse.next();
};

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"], // Protect routes under /dashboard and specific routes
};

export default middleware;
