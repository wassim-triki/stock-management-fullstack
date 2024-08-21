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
import { ApiErrorResponse, ApiSuccessResponse, User } from "@/lib/types";
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

const optionalPasswordsSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    // Only validate if one of them is not empty
    if (password || confirmPassword) {
      // If the user fills out password, confirmPassword should also be filled
      if (password && !confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Please confirm your password",
          path: ["confirmPassword"],
        });
      }

      // If the user fills out confirmPassword, password should also be filled
      if (confirmPassword && !password) {
        ctx.addIssue({
          code: "custom",
          message: "Please provide a password",
          path: ["password"],
        });
      }

      // Ensure passwords match when both are provided
      if (password && confirmPassword && confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "The passwords must match",
          path: ["confirmPassword"],
        });
      }
    }
  });

const userAdminSchema = z.intersection(
  optionalPasswordsSchema,
  z.object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    profile: z.object({
      address: z.string().optional(),
    }),
    role: z.string().min(1, { message: "" }),
    active: z.boolean(),
  }),
);

export type UserFormValues = z.infer<typeof userAdminSchema>;

interface UserFormProps {
  title: string;
  description: string;
  action: string;
  initUser?: User;
}

export const UserForm: React.FC<UserFormProps> = ({
  title,
  description,
  action,
  initUser,
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    email: initUser?.email || "",
    password: "",
    confirmPassword: "",
    profile: {
      address: initUser?.profile.address || "",
    },
    role: initUser?.role || "User",
    active: initUser?.active || true,
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userAdminSchema),
    // defaultValues,
    values: defaultValues,
  });

  const onSubmit = async (data: UserFormValues) => {
    setLoading(true);
    try {
      if (initUser) {
        const res = await updateUser({ id: initUser._id, data });
        toast({
          variant: "success",
          title: res.message,
        });
      } else {
        const res = await createUser(data);
        toast({
          variant: "success",
          title: res.message,
        });
      }
      router.push("/dashboard/users");
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
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="flex flex-col gap-4 md:grid md:grid-cols-1 md:gap-8">
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

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Role"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* @ts-ignore  */}
                      {["Admin", "Manager", "User"].map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        disabled={loading}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FormLabel>Active</FormLabel>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full md:w-min">
            <Button loading={loading} type="submit">
              {action}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
