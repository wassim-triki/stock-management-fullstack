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
function Signup() {
  const { step } = useRegisterFormContext();
  useEffect(() => {
    console.log(step);
  }, [step]);
  return step == 1 ? <StepOne /> : step == 2 ? <StepTwo /> : <StepThree />;
}

Signup.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <MainLayout title="Sign Up">
      <RegistrationLayout>
        <AuthLayout
          title="Sign Up"
          description="Enter your information below to create an account"
          steps
        >
          {page}
        </AuthLayout>
      </RegistrationLayout>
    </MainLayout>
  );
};

export default Signup;
