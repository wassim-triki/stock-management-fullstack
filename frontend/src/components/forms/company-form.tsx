"use client";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldValues,
  useForm,
  UseFormReturn,
  UseFormWatch,
} from "react-hook-form";
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
import { useToast } from "../ui/use-toast";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  Company,
  ROLES,
} from "@/lib/types";
import SubmitButton from "../ui/submit-button";
import { createCompany, updateCompany } from "@/api/company";
import { getDirtyValues } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

const formSchema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  email: z.string().email({ message: "A valid email is required" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z
    .string()
    .url({ message: "A valid URL is required" })
    .optional()
    .or(z.literal("")),
});

export type CompanyFormValues = z.infer<typeof formSchema>;

interface CompanyFormProps {
  title: string;
  description: string;
  action: string;
  initCompany?: Company;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({
  title,
  description,
  action,
  initCompany,
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    name: initCompany?.name || "",
    email: initCompany?.email || "",
    phone: initCompany?.phone || "",
    address: initCompany?.address || "",
    website: initCompany?.website || "",
  };

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });
  const onSubmit = async (data: CompanyFormValues) => {
    try {
      setLoading(true);
      if (initCompany) {
        const updatedFields = getDirtyValues(form.formState.dirtyFields, data);
        const res = await updateCompany({
          id: initCompany._id,
          data: updatedFields,
        });
        toast({
          variant: "success",
          title: res.message,
        });
      } else {
        const res = await createCompany(data);
        toast({
          variant: "success",
          title: res.message,
        });
      }
      auth.role === ROLES.ADMIN && router.push("/dashboard/companies");
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
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Company Name"
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
                  <FormLabel>Company Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Company Email"
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
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Phone Number"
                      {...field}
                    />
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
                      placeholder="Company Address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Company Website"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full md:w-min"
              loading={loading}
              type="submit"
              disabled={!form.formState.isDirty}
            >
              {action}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
