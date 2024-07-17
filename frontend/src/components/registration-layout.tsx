import { RegisterFormProvider } from "@/context/multistep-registration-form-context";
import React from "react";

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RegisterFormProvider>{children}</RegisterFormProvider>;
}
