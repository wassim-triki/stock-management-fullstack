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
import { queryKeys } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const addressSchema = z.object({
  street: z.string().min(1, { message: "" }),
  city: z.string().min(1, { message: "" }),
  state: z.string().min(1, { message: "" }),
  zip: z.string().min(1, { message: "" }),
});

const profileSchema = z.object({
  firstName: z.string().min(1, { message: "" }),
  lastName: z.string().min(1, { message: "" }),
  phone: z.string().regex(/^\+216\d{8}$/, ""),
  address: addressSchema,
});

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "" })
    .email({ message: "Invalid email address" }),
  profile: profileSchema,
  role: z.string().min(1, { message: "" }),
  active: z.boolean(),
});

type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  title: string;
  description: string;
  action: string;
  userId?: string | undefined;
  roles: { _id: string; name: string }[];
}

export const UserForm: React.FC<UserFormProps> = ({
  title,
  description,
  action,
  userId = "",
  roles,
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: initialData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.users, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.users] });
      toast({
        variant: "success",
        title: data.message,
      });
      setOpen(false);
      router.push("/dashboard/users");
    },
  });

  const { mutate: deletee, isPending: isDeleting } = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.users],
      });
      toast({
        variant: "success",
        title: data.message,
      });
      setOpen(false);
      router.push("/dashboard/users");
    },
  });
  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.users] });
      toast({
        variant: "success",
        title: data.message,
      });
      setOpen(false);
      router.push("/dashboard/users");
    },
  });

  const allLoading = isCreating || isLoading || isUpdating || isDeleting;

  const defaultValues = initialData
    ? initialData
    : {
        email: "",
        profile: {
          firstName: "",
          lastName: "",
          phone: "",
          address: {
            street: "",
            city: "",
            state: "",
            zip: "",
          },
        },
        role: "",
        active: false,
      };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    // defaultValues,
    values: defaultValues,
  });

  const onSubmit = async (data: UserFormValues) => {
    setLoading(true);
    if (initialData && params.userId) {
      update({ id: params.userId as string, data });
    } else {
      create(data);
    }
  };

  const onConfirmDelete = async () => {
    deletee(userId);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirmDelete}
        loading={allLoading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={allLoading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      {isError && <div>{error.message}</div>}
      {!isError && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={allLoading}
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={allLoading}
                        placeholder="First Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={allLoading}
                        placeholder="Last Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <FormLabel>Phone</FormLabel>
                        </div>
                        <PhoneInput
                          defaultCountry="TN"
                          placeholder="12 345 678"
                          {...field}
                          disabled={allLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input
                        disabled={allLoading}
                        placeholder="Street"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        disabled={allLoading}
                        placeholder="City"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.address.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input
                        disabled={allLoading}
                        placeholder="State"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.address.zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input
                        disabled={allLoading}
                        placeholder="Zip code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input
                        disabled={allLoading}
                        placeholder="Role"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
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
                            placeholder="Select a category"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* @ts-ignore  */}
                        {roles.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
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
                          disabled={allLoading}
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
            <div></div>

            <div className="w-full md:w-20">
              <SubmitButton loading={allLoading} type="submit">
                {action}
              </SubmitButton>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};
