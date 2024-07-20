import MainLayout from "@/components/main-layout";
import React from "react";
import { GetServerSideProps } from "next";
import RegistrationLayout from "@/components/registration-layout";
import AuthLayout from "@/components/auth-layout";
import LoginComponent from "@/components/login";

function Login({ title, description }: { title: string; description: string }) {
  return (
    <MainLayout title={title}>
      <RegistrationLayout>
        <AuthLayout title={title} description={description}>
          <LoginComponent />
        </AuthLayout>
      </RegistrationLayout>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "Login",
      description:
        "Enter your email and password below to login to your account",
    },
  };
};

export default Login;
