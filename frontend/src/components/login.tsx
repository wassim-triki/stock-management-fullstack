import MainLayout from "@/components/main-layout";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RegistrationLayout from "@/components/registration-layout";
import AuthLayout from "@/components/auth-layout";
import { z } from "zod";
import { IErrorResponse, ISuccessResponse, loginHandler } from "@/api/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { message } from "antd";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertDestructive } from "./ui/alert-destructive";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { useApi } from "@/hooks/useApi";
import { LoadingSpinner } from "./ui/loading-spinner";
import Link from "next/link";
import SubmitButton from "./ui/submit-button";

export interface ILoginForm {
  email: string;
  password: string;
}
const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

function Login() {
  const defaultValues: ILoginForm = {
    email: "",
    password: "",
  };

  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const router = useRouter();
  const { loading, error, apiRequest } = useApi();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const resp = await loginHandler(values, apiRequest);
    if (!resp || resp.success === false) return;
    const successResp = resp as ISuccessResponse;
    // await message.success(successResp.payload.message);
    toast({
      variant: "success",
      title: successResp?.payload.message,
      // description: "Your being redirected to Home...",
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    });
    router.push("/dashboard");
  }
  return (
    <>
      <Form {...form}>
        <form
          id="login-form"
          className="grid gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <FormLabel>Email</FormLabel>
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
          {error && <AlertDestructive error={error.error.message} />}
          <SubmitButton loading={loading}>Login</SubmitButton>
        </form>
      </Form>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </div>
    </>
  );
}

export default Login;
