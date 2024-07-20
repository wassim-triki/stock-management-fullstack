// import { signOut } from "@/app/login/actions";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { getAuthUser } from "@/api/auth";
const Header = async () => {
  const user = await getAuthUser();
  return (
    <header className="sticky top-0 z-10 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold">Stocks</span>
          </Link>
          {/* <Link href="/register/manager">Register your business</Link> */}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {user ? (
            <div className="flex items-center gap-2">
              <p>{user.email}</p>
              <Button>Sign Out</Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>

              <Button variant={"outline"} asChild>
                <Link href="/signup">Create an account</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
