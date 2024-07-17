import MainLayout from "@/components/main-layout";
import RegistrationLayout from "@/components/registration-layout";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function StepOne({
  searchParams = { message: "sdfsdkfhsdf" },
}: {
  searchParams: { message: string };
}) {
  return (
    <section className="flex h-[calc(100vh-57px)] items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-2xl">Sign up</CardTitle>
            <span>1️⃣</span>
          </div>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form id="register-form" className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                minLength={6}
                name="password"
                id="password"
                type="password"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="confirmPassword">Confirm password</Label>
              </div>
              <Input
                minLength={6}
                name="confirmPassword"
                id="confirmPassword"
                type="password"
                required
              />
            </div>
            {/* {searchParams?.message && (
              <div className="text-sm font-medium text-destructive">
                {searchParams.message}
              </div>
            )} */}
            <Button className="w-full" type="submit">
              Next
            </Button>
          </form>
          {/* <OAuthButtons /> */}
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link className="underline" href={"/login"}>
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default StepOne;

StepOne.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <MainLayout title="Home">
      <RegistrationLayout>{page}</RegistrationLayout>
    </MainLayout>
  );
};
