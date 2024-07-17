import MainLayout from "@/components/main-layout";
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
import RegistrationLayout from "@/components/registration-layout";
import AuthLayout from "@/components/auth-layout";
function Login({ searchParams }: { searchParams: { message: string } }) {
  return (
    <>
      <form id="login-form" className="grid gap-4">
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
        {searchParams?.message && (
          <div className="text-sm font-medium text-destructive">
            {searchParams.message}
          </div>
        )}
        <Button
          // formAction={emailLogin}
          className="w-full"
        >
          Login
        </Button>
      </form>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a
          // formAction={signup}
          href="/signup"
          className="underline"
        >
          Sign up
        </a>
      </div>
    </>
  );
}

Login.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <MainLayout title="Login">
      <RegistrationLayout>
        <AuthLayout
          title="Login"
          description="Enter your email and password below to login to your account"
        >
          {page}
        </AuthLayout>
      </RegistrationLayout>
    </MainLayout>
  );
};

export default Login;
