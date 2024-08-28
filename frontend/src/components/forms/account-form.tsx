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
import { changeEmail, changeInfo, changePassword } from "@/api/auth";
import { AlertDestructive } from "../ui/alert-destructive";
import CurrencySelect from "../ui/currency-select";
import { CurrenciesMap } from "@/api/currency";
import { useAuth } from "@/providers/auth-provider";
const changEmailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

export type ChangeEmailFormValues = z.infer<typeof changEmailSchema>;

//TODO; add currency form
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

// const accountInfoSchema = z.object({
//   email: z.string().min(1, "Email is required").email("Invalid email"),

// });
const accountInfoSchema = z.object({
  profile: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    currency: z.string().min(1, "Currency is required"),
  }),
});

export type AccountInfoFormValues = z.infer<typeof accountInfoSchema>;

interface AccountFormProps {
  title: string;
  description: string;
  action: string;
  authUser: User;
  currencies: CurrenciesMap;
}

export const AccountForm: React.FC<AccountFormProps> = ({
  title,
  description,
  action,
  authUser,
  currencies,
}) => {
  const currenciesList = Object.values(currencies);

  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const changeEmailForm = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changEmailSchema),
    defaultValues: {
      email: authUser.email || "",
    },
  });

  const changePasswordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const accountInfoForm = useForm<AccountInfoFormValues>({
    resolver: zodResolver(accountInfoSchema),
    defaultValues: {
      profile: {
        address: authUser.profile.address || "",
        firstName: authUser.profile.firstName || "",
        lastName: authUser.profile.lastName || "",
        currency: authUser.profile.currency.code,
      },
    },
  });

  const {
    mutate: handleUpdateEmail,
    isPending: updatingEmail,
    error: updateEmailError,
  } = useMutation({
    mutationFn: changeEmail,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast({
        variant: "success",
        title: data.message,
      });
      changeEmailForm.reset({
        email: data.data.email,
      });
    },
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
  const { updateStorage } = useAuth();
  const {
    mutate: handleUpdateInfo,
    isPending: updatingInfo,
    error: updateInfoError,
  } = useMutation({
    mutationFn: changeInfo,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast({
        variant: "success",
        title: data.message,
      });
      accountInfoForm.reset({
        ...data.data,
        profile: {
          ...data.data.profile,
          currency: data.data.profile.currency.code,
        },
      });
      updateStorage({ currency: data.data.profile.currency });
    },
  });

  const onSubmitChangeEmail = async (data: ChangeEmailFormValues) => {
    setLoading(true);
    handleUpdateEmail(data.email);
    setLoading(false);
  };

  const onSubmitChangePassword = async (data: ChangePasswordFormValues) => {
    setLoading(true);
    handleChangePass(data);
    setLoading(false);
  };
  const onSubmitChangeInfo = async (data: AccountInfoFormValues) => {
    setLoading(true);
    handleUpdateInfo(data);
    setLoading(false);
  };

  return (
    <div className="flex-1 space-y-4 lg:max-w-3xl">
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <div className="space-y-8">
        {/* Email form */}
        <Form {...changeEmailForm}>
          <form
            onSubmit={changeEmailForm.handleSubmit(onSubmitChangeEmail)}
            className="w-full space-y-4"
          >
            <FormField
              control={changeEmailForm.control}
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
            {updateEmailError && (
              <AlertDestructive error={updateEmailError.message} />
            )}
            <Button
              className="w-full md:w-min"
              disabled={!changeEmailForm.formState.isDirty}
              loading={updatingEmail}
              type="submit"
            >
              {action}
            </Button>
          </form>
        </Form>
        <Form {...accountInfoForm}>
          <form
            onSubmit={accountInfoForm.handleSubmit(onSubmitChangeInfo)}
            className="w-full space-y-4"
          >
            <FormField
              control={accountInfoForm.control}
              name="profile.firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="First name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={accountInfoForm.control}
              name="profile.lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Last name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={accountInfoForm.control}
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

            <FormField
              control={accountInfoForm.control}
              name="profile.currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a currency"
                          />
                        </SelectTrigger>
                      </div>
                    </FormControl>
                    <SelectContent>
                      {currenciesList?.map((currency) => (
                        <SelectItem key={currency.name} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {updateInfoError && (
              <AlertDestructive error={updateInfoError.message} />
            )}
            <Button
              className="w-full md:w-min"
              disabled={!accountInfoForm.formState.isDirty}
              loading={updatingInfo}
              type="submit"
            >
              {action}
            </Button>
          </form>
        </Form>
        <Separator />
        <Form {...changePasswordForm}>
          <form
            onSubmit={changePasswordForm.handleSubmit(onSubmitChangePassword)}
            className="w-full space-y-4"
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
              disabled={!changePasswordForm.formState.isDirty}
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
