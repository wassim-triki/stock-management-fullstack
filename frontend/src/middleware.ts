import { NextRequest, NextResponse } from "next/server";
import fetchHelper from "./lib/fetchInstance";
import { ApiSuccessResponse, User, ROLES } from "./lib/types"; // Assuming ROLES is defined
import { cookies } from "next/headers";
import appConfig from "@/lib/config";

const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;
  const cookieStore = cookies();
  const cookieValue = cookieStore.get("session")?.value;

  let isAuthenticated = false;
  let userRole: string | null = null; // Store the user's role if authenticated

  try {
    // Fetch user details from the authentication API
    const response = await fetch(`${appConfig.apiUrl}/api/auth/me`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: "session=" + cookieValue,
      },
    });

    if (response.ok) {
      const { data: user }: ApiSuccessResponse<User> = await response.json();
      isAuthenticated = true;
      userRole = user.role; // Set the user's role
    }
  } catch (error) {
    console.error("Error fetching authentication status:", error);
    return NextResponse.redirect(new URL("/maintenance", req.url));
  }

  // Redirect the root ("/") to either dashboard or login page
  //TODO: updpate with landing page instead
  if (pathname === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Handle redirection based on authentication status
  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Role-based access control (RBAC)
  const rolePermissions: Record<string, string[]> = {
    "/dashboard/companies": [ROLES.ADMIN], // Only admin can access /dashboard/admin
    "/dashboard/users": [ROLES.ADMIN], // Only admin can access /dashboard/admin
  };

  // Check if the current path has role restrictions
  const restrictedPath = Object.keys(rolePermissions).find((path) =>
    pathname.startsWith(path),
  );

  if (restrictedPath) {
    const allowedRoles = rolePermissions[restrictedPath];

    // If the user is not authorized, redirect them to an unauthorized page or dashboard
    if (!allowedRoles?.includes(userRole as string)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/dashboard/:path*", "/", "/login", "/signup"], // Protect root ("/") and routes under /dashboard
};

export default middleware;
