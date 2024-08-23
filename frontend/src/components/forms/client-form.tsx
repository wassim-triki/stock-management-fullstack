"use client";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useToast } from "@/components/ui/use-toast";
import { Client, ApiErrorResponse } from "@/lib/types";
import { createClient, updateClient } from "@/api/client";
import { Checkbox } from "../ui/checkbox";

// Zod validation schema for the client form
const formSchema = z.object({
  name: z.string().min(1, { message: "Client name is required" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .min(1, { message: "Email is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }).optional(),
  address: z.string().optional(),
  active: z.boolean(),
});

export type ClientFormValues = z.infer<typeof formSchema>;

interface ClientFormProps {
  title: string;
  description: string;
  action: string;
  initClient?: Client;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  title,
  description,
  action,
  initClient,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const defaultValues: ClientFormValues = {
    name: initClient?.name || "",
    email: initClient?.email || "",
    phone: initClient?.phone || "",
    address: initClient?.address || "",
    active: initClient?.active || true,
  };

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: ClientFormValues) => {
    setLoading(true);
    try {
      if (initClient) {
        const res = await updateClient({
          id: initClient._id,
          data: data,
        });
        toast({
          variant: "success",
          title: res.message,
        });
      } else {
        const res = await createClient(data);
        toast({
          variant: "success",
          title: res.message,
        });
      }
      // Redirect to clients list or wherever needed
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
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter client name"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      disabled={loading}
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
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
                      placeholder="Enter phone number"
                      {...field}
                    />
                  </FormControl>
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
                      placeholder="Enter address"
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
            <Button
              className="w-full md:w-min"
              loading={loading}
              disabled={!form.formState.isDirty}
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
