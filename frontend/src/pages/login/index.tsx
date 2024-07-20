import MainLayout from "@/components/main-layout";
import React from "react";
import { GetServerSideProps } from "next";
import RegistrationLayout from "@/components/registration-layout";
import AuthLayout from "@/components/auth-layout";
import LoginComponent from "@/components/login";
import { withoutAuth } from "@/lib/auth";

function Login({ title, description }: { title: string; description: string }) {
  return (
    <MainLayout title={title}>
      <AuthLayout title={title} description={description}>
        <LoginComponent />
      </AuthLayout>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = withoutAuth(
  async (ctx) => {
    // Any additional data fetching if needed
    return {
      props: {
        title: "Login",
        description:
          "Enter your email and password below to login to your account",
      },
    };
  },
);

export default Login;
