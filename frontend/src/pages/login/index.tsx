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
import LoginComponent from "@/components/login";
export const getServerSideProps = async () => {
  return {
    props: {
      title: "Login",
      description:
        "Enter your email and password below to login to your account",
    },
  };
};

function Login() {
  return (
    <>
      <LoginComponent />
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
