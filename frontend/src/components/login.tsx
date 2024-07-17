import MainLayout from "@/components/main-layout";
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
    const resp = await loginHandler(values);
    if (resp.success === false) {
      setErrorResponse(resp as IErrorResponse);
      return;
    }
    const successResp = resp as ISuccessResponse;
    console.log(successResp);
    await message.success(successResp.payload.message);
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
          {errorResponse && (
            <div className="text-sm font-medium text-destructive">
              {errorResponse.error.message}
            </div>
          )}
          <Button
            // formAction={emailLogin}
            type="submit"
            className="w-full"
          >
            Login
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="underline">
          Sign up
        </a>
      </div>
    </>
  );
}

export default Login;
