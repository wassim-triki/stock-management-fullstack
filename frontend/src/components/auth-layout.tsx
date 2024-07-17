import React, { use } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useRegisterFormContext } from "@/context/multistep-registration-form-context";

interface AuthLayoutProps {
  title: string;
  description: string;
  stepIndicator?: React.ReactNode;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  description,
  children,
}) => {
  const { step } = useRegisterFormContext();
  return (
    <section className="flex h-[calc(100vh-57px)] items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-2xl">{title}</CardTitle>
            {step && (
              <span className="text-2xl font-black text-slate-500">
                {step}/3
              </span>
            )}
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">{children}</CardContent>
      </Card>
    </section>
  );
};

export default AuthLayout;
