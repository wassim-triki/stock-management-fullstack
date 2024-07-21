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
import { useAxios } from "@/lib/axios";
import { AlertDestructive } from "./ui/alert-destructive";
import { ToastAction } from "./ui/toast";
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/types";
import { AxiosError } from "axios";
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
  const [{ loading: loginLoading, error: loginError }, executePut] = useAxios<
    ApiSuccessResponse,
    ILoginForm,
    ApiErrorResponse
  >(
    {
      url: "/api/auth/login",
      method: "POST",
    },
    { manual: true },
  );
  // const { loading, error, apiRequest } = useApi();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    await executePut({ data: values }).then(({ data }) => {
      toast({
        variant: "success",
        title: data.payload.message,
        action: <ToastAction altText="Okay">Okay</ToastAction>,
      });
    });
    router.push("/dashboard");
    router.refresh();
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
          {loginError && (
            <AlertDestructive
              error={(loginError as unknown as ApiErrorResponse).error.message}
            />
          )}
          <SubmitButton loading={loginLoading}>Login</SubmitButton>
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
