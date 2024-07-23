import { NextRequest, NextResponse } from "next/server";
import appConfig from "./lib/config";
import { cookies } from "next/headers";
const getAuthUser = async (): Promise<boolean> => {
  try {
    const cookieStore = cookies();
    const cookieValue = cookieStore.get("session")?.value;
    const response = await fetch(`${appConfig.apiUrl}/api/auth/me`, {
      credentials: "include", // Ensure credentials are sent
      headers: {
        "Content-Type": "application/json",
        Cookie: "session=" + cookieValue,
      },
    });

    if (!response.ok) {
      throw new Error("User not authenticated");
    }

    const data = await response.json();
    return !!data; // Return true if user data exists, indicating authenticated user
  } catch (error) {
    console.log(error);
    return false; // Return false if there was an error or user is not authenticated
  }
};

const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  const isAuthenticated = await getAuthUser();
  console.log(isAuthenticated);

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
