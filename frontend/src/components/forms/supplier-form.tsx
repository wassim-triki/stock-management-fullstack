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

const formSchema = z.object({
  name: z.string().min(1, { message: "" }),
  email: z
    .string()
    .min(1, { message: "" })
    .email({ message: "Invalid email address" }),
  phone: z.string().regex(/^$|^\d{8,14}$/, { message: "Invalid phone number" }),
  address: z.string().optional(),
  active: z.boolean(),
});

type SupplierFormValues = z.infer<typeof formSchema>;

interface SupplierFormProps {
  // initialData?: SupplierFormValues | null;
  title: string;
  description: string;
  action: string;
  initSupplier?: Supplier;
}

export const SupplierForm: React.FC<SupplierFormProps> = ({
  title,
  description,
  action,
  initSupplier,
  // initialData,
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultValues = initSupplier
    ? initSupplier
    : {
        name: "",
        email: "",
        phone: "",
        address: "",
        active: true,
      };

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });

  const onSubmit = async (data: SupplierFormValues) => {
    setLoading(true);
    try {
      if (initSupplier) {
        const res = await updateSupplier({
          id: initSupplier._id,
          data,
        });
        toast({
          variant: "success",
          title: res.message,
        });
      } else {
        const res = await createSupplier(data);
        toast({
          variant: "success",
          title: res.message,
        });
      }
      router.push("/dashboard/suppliers");
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
      {true && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Supplier name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
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
                          disabled={loading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
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
            </div>

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

            <div className="w-full md:w-min">
              <Button loading={loading} type="submit">
                {action}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};
