import MainLayout from "@/components/main-layout";
import RegistrationLayout from "@/components/registration-layout";
import React, { useState } from "react";
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
import {
  checkEmailAvailability,
  IErrorResponse,
  stepTwoHandler,
} from "@/api/auth";
import AuthLayout from "@/components/auth-layout";
import { AlertDestructive } from "../ui/alert-destructive";
import { LoadingSpinner } from "../ui/loading-spinner";
import { useApi } from "@/hooks/useApi";

const formSchema = z.object({
  firstName: z
    .string()
    .regex(
      /^[A-Za-z']+$/,
      "First name should not contain numbers or special characters",
    )
    .min(1, "First name is required")
    .min(2, "Last name must be longer that 2 characters")
    .max(50, "First name must be 50 characters or less"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .regex(
      /^[A-Za-z']+$/,
      "First name should not contain numbers or special characters",
    )
    .min(2, "Last name must be longer that 2 characters")
    .max(50, "Last name must be 50 characters or less"),
});

function StepTwo() {
  const { updateRegistrationData, nextStep, prevStep, formData } =
    useRegisterFormContext();
  const defaultValues: Partial<IRegisterData> = {
    firstName: formData?.firstName ?? "",
    lastName: formData?.lastName ?? "",
  };

  const { loading, error, apiRequest } = useApi();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const resp = await stepTwoHandler(values, apiRequest);
    if (!resp || resp.success === false) return;
    updateRegistrationData(values);
    handleNextStep();
  }

  const handleNextStep = () => {
    nextStep();
  };

  const handlePrevStep = () => {
    prevStep();
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
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <FormLabel>First name*</FormLabel>
                    </div>
                    <Input placeholder="John" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <FormLabel>Last name*</FormLabel>
                    </div>
                    <Input placeholder="Doe" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <AlertDestructive error={error.error.message} />}
          <div className="flex justify-between gap-4">
            <Button
              onClick={handlePrevStep}
              className="w-full"
              type="button"
              variant={"secondary"}
            >
              Back
            </Button>
            <Button className="w-full" type="submit">
              {loading ? <LoadingSpinner /> : "Next"}
            </Button>
          </div>
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

export default StepTwo;
