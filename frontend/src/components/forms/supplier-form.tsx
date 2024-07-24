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
import {
  createSupplier,
  deleteSupplier,
  getSupplierById,
  updateSupplier,
} from "@/api/supplier";
import { ApiErrorResponse, ApiSuccessResponse, Supplier } from "@/lib/types";
import SubmitButton from "../ui/submit-button";
import { AlertModal } from "../modal/alert-modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants";

const addressSchema = z.object({
  street: z.string().min(1, { message: "" }),
  city: z.string().min(1, { message: "" }),
  state: z.string().min(1, { message: "" }),
  zip: z.string().min(1, { message: "" }),
});

const formSchema = z.object({
  companyName: z.string().min(1, { message: "" }),
  contactEmail: z
    .string()
    .min(1, { message: "" })
    .email({ message: "Invalid email address" }),
  phone: z.string().regex(/^\+216\d{8}$/, ""),
  address: addressSchema,
  active: z.boolean(),
});

type SupplierFormValues = z.infer<typeof formSchema>;

interface SupplierFormProps {
  // initialData?: SupplierFormValues | null;
  title: string;
  description: string;
  action: string;
  supplierId?: string;
}

export const SupplierForm: React.FC<SupplierFormProps> = ({
  title,
  description,
  action,
  supplierId = "",
  // initialData,
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
    queryKey: [queryKeys.suppliers, supplierId],
    queryFn: () => getSupplierById(supplierId),
    enabled: !!supplierId,
  });

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: updateSupplier,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.suppliers],
      });
      toast({
        variant: "success",
        title: data.message,
      });
      setOpen(false);
      router.push("/dashboard/suppliers");
    },
  });
  const { mutate: deletee, isPending: isDeleting } = useMutation({
    mutationFn: deleteSupplier,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.suppliers],
      });
      toast({
        variant: "success",
        title: data.message,
      });
      setOpen(false);
      router.push("/dashboard/suppliers");
    },
  });
  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: createSupplier,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.suppliers],
      });
      toast({
        variant: "success",
        title: data.message,
      });
      setOpen(false);
      router.push("/dashboard/suppliers");
    },
  });

  const allLaoding = isCreating || isLoading || isUpdating || isDeleting;

  const defaultValues = initialData
    ? initialData
    : {
        companyName: "",
        contactEmail: "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          zip: "",
        },
        active: false,
      };

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });

  const onSubmit = async (data: SupplierFormValues) => {
    setLoading(true);
    if (initialData && params.supplierId) {
      update({ id: params.supplierId as string, data });
    } else {
      // Create new supplier
      create(data);
    }
  };

  const onConfirmDelete = async () => {
    deletee(supplierId);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirmDelete}
        loading={allLaoding}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={allLaoding}
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
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={allLaoding}
                        placeholder="Company name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        disabled={allLaoding}
                        placeholder="Contact email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
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
                          disabled={allLaoding}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input
                        disabled={allLaoding}
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
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        disabled={allLaoding}
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
                name="address.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input
                        disabled={allLaoding}
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
                name="address.zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input
                        disabled={allLaoding}
                        placeholder="Zip code"
                        {...field}
                      />
                    </FormControl>
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
                          disabled={allLaoding}
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

            <div className="w-full md:w-min">
              <SubmitButton loading={allLaoding} type="submit">
                {action}
              </SubmitButton>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};
