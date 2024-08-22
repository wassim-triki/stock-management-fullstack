//user-form.tsx
"use client";
import * as z from "zod";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "../ui/use-toast";
import { PhoneInput } from "../ui/phone-input";
import { createUser, deleteUser, getUserById, updateUser } from "@/api/user";
import { ApiErrorResponse, ApiSuccessResponse, ROLES, User } from "@/lib/types";
import SubmitButton from "../ui/submit-button";
import { AlertModal } from "../modal/alert-modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { registerSchema } from "../signup";
import { changePassword } from "@/api/auth";
import { AlertDestructive } from "../ui/alert-destructive";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmNewPassword: z.string(),
  })
  .superRefine(({ confirmNewPassword, newPassword }, ctx) => {
    if (confirmNewPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords must match",
        path: ["confirmNewPassword"],
      });
    }
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const accountInfoSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  profile: z.object({
    address: z.string().optional(),
  }),
});

export type AccountInfoFormValues = z.infer<typeof accountInfoSchema>;

interface AccountFormProps {
  title: string;
  description: string;
  action: string;
  authUser?: User;
}

export const AccountForm: React.FC<AccountFormProps> = ({
  title,
  description,
  action,
  authUser,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const changePasswordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    values: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const defaultValues = {
    email: authUser?.email || "",
    password: "",
    profile: {
      address: authUser?.profile?.address || "",
    },
    role: authUser?.role || "User",
  };
  const form = useForm<AccountInfoFormValues>({
    resolver: zodResolver(accountInfoSchema),
    // defaultValues,
    values: defaultValues,
  });
  const queryClient = useQueryClient();
  const {
    mutate: handleChangePass,
    isPending: changingPass,
    error: changePassError,
  } = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast({
        variant: "success",
        title: data.message,
      });
      changePasswordForm.reset();
    },
  });

  const onSubmitChangePassword = async (data: ChangePasswordFormValues) => {
    setLoading(true);
    try {
      handleChangePass(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: (error as ApiErrorResponse).message,
      });
    } finally {
      setLoading(false);
    }
  };
  const onSubmitChangeInfo = async (data: AccountInfoFormValues) => {
    setLoading(true);
    try {
      console.log(data);
      // toast({
      //   variant: "success",
      //   title: res.message,
      // });
    } catch (error) {
      toast({
        variant: "destructive",
        title: (error as ApiErrorResponse).message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 lg:max-w-3xl">
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <div className="space-y-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitChangeInfo)}
            className="w-full space-y-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profile.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full md:w-min" loading={loading} type="submit">
              {action}
            </Button>
          </form>
        </Form>
        <Separator />
        <Form {...changePasswordForm}>
          <form
            onSubmit={changePasswordForm.handleSubmit(onSubmitChangePassword)}
            className="w-full space-y-8"
          >
            <FormField
              control={changePasswordForm.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <FormLabel>Old password</FormLabel>
                      </div>
                      <Input type="password" {...field} />
                    </div>
                  </FormControl>
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
            <FormField
              control={changePasswordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <FormLabel>New password</FormLabel>
                      </div>
                      <Input type="password" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={changePasswordForm.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <FormLabel>Confirm new password</FormLabel>
                      </div>
                      <Input type="password" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {changePassError && (
              <AlertDestructive error={changePassError.message} />
            )}
            <Button
              className="w-full md:w-min"
              loading={changingPass}
              type="submit"
            >
              {action}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
