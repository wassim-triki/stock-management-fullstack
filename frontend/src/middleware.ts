import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "./api/auth";

const middleware = async (req: NextRequest) => {
  const isAuthenticated = await getAuthUser();

  const protectedRoutes = ["/dashboard"];
  const publicRoutes = ["/login"];

  const url = req.nextUrl.clone();
  const path = url.pathname;

  if (isAuthenticated && publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isAuthenticated && protectedRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/dashboard", "/login", "/signup"], // Add more routes as needed
};

export default middleware;
