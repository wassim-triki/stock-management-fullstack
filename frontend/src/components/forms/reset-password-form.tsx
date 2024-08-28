"use client";

import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/types";
import { resetPasswordRequest } from "@/api/auth";

// Zod schema for form validation
const formSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Path to show the error under confirmPassword field
  });

export type ResetPasswordFormValues = z.infer<typeof formSchema>;

export const ResetPasswordForm: React.FC<{ token: string }> = ({ token }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Use react-query's mutation for resetting the password
  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: ({ password }: ResetPasswordFormValues) =>
      resetPasswordRequest(token, password), // Pass token to the reset request
    onSuccess: (data: ApiSuccessResponse) => {
      toast({
        variant: "success",
        title: "Password Reset Successful",
        description: "You can now log in with your new password.",
      });
      router.push("/login");
    },
    onError: (error: ApiErrorResponse) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    setLoading(true);
    resetPassword(data);
  };

  return (
    <>
      <Form {...form}>
        <form
          id="reset-password-form"
          className="grid gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid gap-2">
                    <FormLabel>New Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
                      disabled={loading || isPending}
                      {...field}
                    />
                  </div>
                </FormControl>
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
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Confirm your new password"
                      disabled={loading || isPending}
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            loading={loading || isPending}
            disabled={!form.formState.isDirty}
          >
            Reset Password
          </Button>
        </form>
      </Form>
    </>
  );
};
