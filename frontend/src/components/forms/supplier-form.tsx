"use client";
import * as z from "zod";
import { useState } from "react";
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
import { updateSupplier } from "@/api/supplier";
import { useAxios } from "@/lib/axios/axios-client";
import { ApiErrorResponse, ApiSuccessResponse, Supplier } from "@/lib/types";
import SubmitButton from "../ui/submit-button";
import { AlertModal } from "../modal/alert-modal";

const addressSchema = z.object({
  street: z.string().min(1, { message: "" }),
  city: z.string().min(1, { message: "" }),
  state: z.string().min(1, { message: "" }),
  zip: z.string().min(1, { message: "" }),
});

const formSchema = z.object({
  companyName: z.string().min(1, { message: "" }),
  contactName: z.string().min(1, { message: "" }),
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
  initialData?: SupplierFormValues | null;
  title: string;
  description: string;
  action: string;
}

export const SupplierForm: React.FC<SupplierFormProps> = ({
  title,
  description,
  action,
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultValues: SupplierFormValues = initialData
    ? initialData
    : {
        companyName: "",
        contactName: "",
        contactEmail: "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          zip: "",
        },
        active: true,
      };

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [{ loading: updateLoading, error: updateError }, executeUpdate] =
    useAxios<ApiSuccessResponse<Supplier>, Partial<Supplier>, ApiErrorResponse>(
      {
        url: "/api/suppliers/:id", // The URL will be set dynamically when calling executePut
        method: "PUT",
      },
      { manual: true },
    );
  const [{ loading: createLoading, error: createError }, executeCreate] =
    useAxios<ApiSuccessResponse<Supplier>, Partial<Supplier>, ApiErrorResponse>(
      {
        url: "/api/suppliers", // The URL will be set dynamically when calling executePut
        method: "POST",
      },
      { manual: true },
    );
  const [{ data: res, loading: deleteLoading, error }, executeDelete] =
    useAxios<ApiSuccessResponse<Supplier>, any, ApiErrorResponse>(
      {
        method: "DELETE",
      },
      { manual: true },
    );

  const onSubmit = async (data: SupplierFormValues) => {
    setLoading(true);
    if (initialData) {
      // Update existing supplier
      await executeUpdate({
        url: `/api/suppliers/${params.supplierId}`,
        data,
      })
        .then(({ data }) => {
          toast({
            variant: "success",
            title: data.message,
          });
          router.push(`/dashboard/suppliers`);
          // router.refresh();
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: error.message,
          });
        })
        .finally(() => setLoading(false));
    } else {
      // Create new supplier
      await executeCreate({
        data,
      })
        .then(({ data }) => {
          toast({
            variant: "success",
            title: data.message,
          });
          router.push(`/dashboard/suppliers`);
          // router.refresh();
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: error.message,
          });
        })
        .finally(() => setLoading(false));
    }
  };

  const onConfirmDelete = async () => {
    executeDelete({
      url: `/api/suppliers/${params.supplierId}`,
    })
      .then(({ data }) => {
        toast({
          variant: "success",
          title: data.message,
          // TODO; add undo
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: error.message,
        });
      })
      .finally(() => {
        setOpen(false);
        router.push(`/dashboard/suppliers`);
      });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirmDelete}
        loading={deleteLoading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
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
                      disabled={loading}
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
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Contact name"
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
                      disabled={loading}
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
                    <Input disabled={loading} placeholder="Street" {...field} />
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
                    <Input disabled={loading} placeholder="City" {...field} />
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
                    <Input disabled={loading} placeholder="State" {...field} />
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
                      disabled={loading}
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
          <div></div>

          <div className="w-full md:w-20">
            <SubmitButton loading={updateLoading} type="submit">
              {action}
            </SubmitButton>
          </div>
        </form>
      </Form>
    </>
  );
};
