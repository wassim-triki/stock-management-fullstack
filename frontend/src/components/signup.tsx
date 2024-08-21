"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/submit-button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertDestructive } from "./ui/alert-destructive";
import { ToastAction } from "./ui/toast";
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/types";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, signUpUser } from "@/api/auth";
import { Button } from "./ui/button";
import { queryKeys } from "@/constants/query-keys";

export const registerSchema = z
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

export type SignupFormValues = z.infer<typeof registerSchema>;

function Signup() {
  const defaultValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const { toast } = useToast();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues,
  });
  const router = useRouter();

  const queryClient = useQueryClient();
  const {
    mutate: login,
    isPending: isLoggingIn,
    error: LoginError,
    isError: isLoginError,
  } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.auth] });
      router.push("/dashboard");
    },
  });
  const {
    mutate: signup,
    isPending: isSigningUp,
    error,
    isError,
  } = useMutation({
    mutationFn: signUpUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.auth] });
      toast({
        variant: "success",
        title: data.message,
      });
      login({
        email: form.getValues().email,
        password: form.getValues().password,
      });
    },
  });

  async function onSubmit(values: SignupFormValues) {
    signup(values);
  }
  return (
    <>
      <Form {...form}>
        <form
          id="signup-form"
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
                      <FormLabel>Password</FormLabel>
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
                      <FormLabel>Confirm password</FormLabel>
                    </div>
                    <Input type="password" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isError && error?.message && (
            <AlertDestructive error={error.message} />
          )}
          <Button loading={isSigningUp || isLoggingIn}>Sign up</Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Login
        </Link>
      </div>
    </>
  );
}

export default Signup;
