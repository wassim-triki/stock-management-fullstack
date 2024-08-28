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
import { loginUser, sendPasswordResetEmail } from "@/api/auth"; // Import sendPasswordResetEmail API call
import { Button } from "./ui/button";
import { queryKeys } from "@/constants/query-keys";
import { useAuth } from "@/providers/auth-provider";

const adminCredentials = {
  email: "admin@admin.com",
  password: "adminadmin",
};
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
  const auth = useAuth();

  const queryClient = useQueryClient();

  const {
    mutate: login,
    isPending: isLoggingIn,
    error,
    isError,
  } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.auth] });
      toast({
        variant: "success",
        title: data.message,
      });
      auth.updateStorage({
        role: data.data.role,
        currency: data.data.profile.currency,
      });
      router.refresh();
      // router.push("/dashboard");
    },
  });

  const {
    mutate: forgotPassword,
    isPending: isSendingEmail,
    error: sendingError,
  } = useMutation({
    mutationFn: sendPasswordResetEmail, // Backend email reset function (implementation later)
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Password reset email sent",
        description: "Check your inbox for further instructions.",
      });
    },
    onError: (error: ApiErrorResponse) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    login(values);
  }

  function handleForgotPassword() {
    const email = form.getValues("email");
    if (email) {
      forgotPassword(email); // Trigger password reset email
    } else {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter your email before resetting password.",
      });
    }
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
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      {...field}
                    />
                  </div>
                </FormControl>
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Button
                        variant="link"
                        type="button"
                        onClick={handleForgotPassword}
                        loading={isSendingEmail}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <Input type="password" {...field} />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          {error?.message && <AlertDestructive error={error?.message} />}
          {sendingError?.message && (
            <AlertDestructive error={sendingError?.message} />
          )}
          <Button loading={isLoggingIn} disabled={isSendingEmail}>
            Login
          </Button>
          {/* <Button
            variant={"outline"}
            onClick={() => {
              form.setValue("email", adminCredentials.email);
              form.setValue("password", adminCredentials.password);
            }}
            loading={isLoggingIn || isSendingEmail}
          >
            Login as admin
          </Button> */}
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
