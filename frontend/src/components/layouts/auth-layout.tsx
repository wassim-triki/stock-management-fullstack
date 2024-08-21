import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  description: string;
};
function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <section className="flex h-[calc(100vh-57px)] items-center justify-center">
      <Card className="mx-auto w-full max-w-[22rem] md:w-[26rem] md:max-w-[26rem]">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-2xl"> {title}</CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">{children}</CardContent>
      </Card>
    </section>
  );
}

export default AuthLayout;
