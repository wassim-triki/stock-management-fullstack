import MainLayout from "@/components/main-layout";
import React, { useEffect } from "react";
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
import StepOne from "@/components/signup/step-one";
import { useRegisterFormContext } from "@/context/multistep-registration-form-context";
import StepTwo from "@/components/signup/step-two";
import StepThree from "@/components/signup/step-three";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "Sign Up",
      description: "Enter your information below to create an account",
    },
  };
};

type SignupProps = {
  title: string;
  description: string;
};

function Signup({ title, description }: SignupProps) {
  const { step } = useRegisterFormContext();

  useEffect(() => {
    console.log(step);
  }, [step]);

  return (
    <>
      {step === 1 && <StepOne />}
      {step === 2 && <StepTwo />}
      {step === 3 && <StepThree />}
    </>
  );
}

Signup.getLayout = function getLayout(
  page: React.ReactNode,
  pageProps: SignupProps,
) {
  return (
    <MainLayout title={pageProps.title}>
      <RegistrationLayout>
        <AuthLayout
          title={pageProps.title}
          description={pageProps.description}
          steps
        >
          {page}
        </AuthLayout>
      </RegistrationLayout>
    </MainLayout>
  );
};

const SignupPage = (props: SignupProps) => {
  return <Signup {...props} />;
};

export default SignupPage;
