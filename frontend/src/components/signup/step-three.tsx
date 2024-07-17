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
import { IErrorResponse, ISuccessResponse, signupHandler } from "@/api/auth";
import AuthLayout from "@/components/auth-layout";
import { PhoneInput } from "@/components/ui/phone-input";
import { AlertDestructive } from "../ui/alert-destructive";
import { message } from "antd";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { useApi } from "@/hooks/useApi";
import { LoadingSpinner } from "../ui/loading-spinner";

const formSchema = z.object({
  phone: z
    .string()
    .regex(/^(\+216\d{8})?$/, "Phone number must be in the format +216xxxxxxxx")
    .optional(),
  street: z
    .string()
    .max(100, "Street must be 100 characters or less")
    .optional(),
  city: z.string().max(50, "City must be 50 characters or less").optional(),
  state: z.string().max(50, "State must be 50 characters or less").optional(),
  zip: z
    .string()
    .regex(/^(\d{4})?$/, "Zip code must be exactly 4 digits")
    .optional(),
});

function StepThree() {
  const { updateRegistrationData, prevStep, formData } =
    useRegisterFormContext();
  const defaultValues: Partial<IRegisterData> = {
    phone: formData?.phone ?? "",
    street: formData?.street ?? "",
    city: formData?.city ?? "",
    state: formData?.state ?? "",
    zip: formData?.zip ?? "",
  };

  const { loading, error, apiRequest } = useApi();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const router = useRouter();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle form submission
    updateRegistrationData(values);
    if (formData) {
      const data: IRegisterData = {
        ...values,
        ...formData,
      };
      const resp = await signupHandler(data, apiRequest);
      if (!resp || resp.success === false) {
        return;
      }
      const successResp = resp as ISuccessResponse;
      toast({
        variant: "success",
        title: successResp?.payload.message,
        // description: "Your being redirected...",
        action: <ToastAction altText="Okay">Okay</ToastAction>,
      });
      router.push("/login");
    }
    return;
  }

  const handlePrevStep = () => {
    prevStep();
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <FormLabel>Phone*</FormLabel>
                    </div>
                    <PhoneInput
                      defaultCountry="TN"
                      placeholder="12 345 678"
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
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <FormLabel>Street*</FormLabel>
                    </div>
                    <Input placeholder="123 Main St" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <FormLabel>City*</FormLabel>
                    </div>
                    <Input placeholder="New York" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <FormLabel>State*</FormLabel>
                      </div>
                      <Input placeholder="NY" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <FormLabel>Zip*</FormLabel>
                      </div>
                      <Input type="number" placeholder="8090" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
              {loading ? <LoadingSpinner /> : "Create account"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export default StepThree;
