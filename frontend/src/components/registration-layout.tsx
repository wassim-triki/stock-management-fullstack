import {
  RegisterFormProvider,
  useRegisterFormContext,
} from "@/context/multistep-registration-form-context";
import React, { useEffect } from "react";

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RegisterFormProvider>{children}</RegisterFormProvider>;
}
