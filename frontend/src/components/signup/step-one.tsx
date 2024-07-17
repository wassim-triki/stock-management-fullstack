import MainLayout from "@/components/main-layout";
import RegistrationLayout from "@/components/registration-layout";
import React, { useEffect, useState } from "react";
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
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import {
  IRegisterData,
  useRegisterFormContext,
} from "@/context/multistep-registration-form-context";
import { useRouter } from "next/navigation";
import { checkEmailAvailability, IErrorResponse } from "@/api/auth";
import AuthLayout from "@/components/auth-layout";
import { AlertDestructive } from "../ui/alert-destructive";

const formSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords must match",
        path: ["confirmPassword"],
      });
    }
  });

function StepOne() {
  const { updateRegistrationData, initStep, nextStep, formData } =
    useRegisterFormContext();
  const router = useRouter();
  const defaultValues: Partial<IRegisterData> = {
    email: formData?.email ?? "",
    password: formData?.password ?? "",
    confirmPassword: formData?.confirmPassword ?? "",
  };
  const [errorResponse, setErrorResponse] = useState<IErrorResponse | null>(
    null,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setErrorResponse(null);
    const resp = await checkEmailAvailability(values);
    if (resp.success === false) {
      setErrorResponse(resp as IErrorResponse);
      return;
    }
    updateRegistrationData(values);
    handleNextStep();
  }

  const handleNextStep = () => {
    nextStep();
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="login-form"
          className="grid gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <FormLabel>Email*</FormLabel>
                    </div>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <FormLabel>Password*</FormLabel>
                    </div>
                    <Input type="password" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <FormLabel>Confirm password*</FormLabel>
                    </div>
                    <Input type="password" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {errorResponse && (
            <AlertDestructive error={errorResponse.error.message} />
          )}
          <Button className="w-full" type="submit">
            Next
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link className="underline" href={"/login"}>
          Login
        </Link>
      </div>
    </>
  );
}

export default StepOne;
