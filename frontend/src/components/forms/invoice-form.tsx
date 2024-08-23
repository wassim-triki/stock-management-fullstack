"use client";
import * as z from "zod";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
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
  PurchaseOrder,
  Invoice,
  ApiErrorResponse,
  Client,
  Supplier,
} from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SingleDatePicker } from "../ui/single-date-picker";
import { createInvoice, updateInvoice } from "@/api/invoice";

// Zod validation schema for the form
const formSchema = z.object({
  invoiceNumber: z.string().min(1, { message: "Invoice number is required" }),
  invoiceType: z.enum(["Supplier", "Client"], {
    required_error: "Invoice type is required",
  }),
  entityId: z.string().min(1, { message: "Supplier/Client is required" }), // This will either be supplier or client based on invoiceType
  purchaseOrder: z.string().min(1, { message: "Purchase order is required" }),
  totalAmount: z
    .string()
    .min(1, { message: "Total amount is required" })
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0;
      },
      { message: "Total amount must be a positive number" },
    ),
  paidAmount: z
    .string()
    .min(1, { message: "Paid amount is required" })
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0;
      },
      { message: "Paid amount must be a positive number" },
    ),
  dueDate: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) {
      return new Date(val);
    }
    return val;
  }, z.date().optional()),
});

export type InvoiceFormValues = z.infer<typeof formSchema>;

interface InvoiceFormProps {
  title: string;
  description: string;
  action: string;
  supplierInvoiceId?: string | undefined;
  purchaseOrders: PurchaseOrder[];
  purchaseOrder?: PurchaseOrder;
  initInvoice?: Invoice;
  suppliers: Supplier[];
  clients: Client[];
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  title,
  description,
  action,
  supplierInvoiceId = "",
  purchaseOrders,
  purchaseOrder,
  initInvoice,
  suppliers,
  clients,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const initialData: InvoiceFormValues = {
    invoiceNumber: initInvoice?.invoiceNumber || "",
    invoiceType: initInvoice?.invoiceType || "Supplier", // Default to "Supplier"
    entityId: initInvoice?.supplier?._id || "", // This will be the supplier or client based on invoiceType
    purchaseOrder: purchaseOrder?._id || initInvoice?.purchaseOrder?._id || "",
    totalAmount:
      purchaseOrder?.orderTotal.toString() ||
      initInvoice?.totalAmount?.toString() ||
      "0",
    paidAmount: initInvoice?.paidAmount?.toString() || "0",
    dueDate:
      purchaseOrder?.orderDate ||
      (initInvoice?.dueDate ? new Date(initInvoice.dueDate) : new Date()),
  };

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const watchInvoiceType = useWatch({
    control: form.control,
    name: "invoiceType",
  });

  const onSubmit = async (data: InvoiceFormValues) => {
    setLoading(true);
    try {
      if (initInvoice) {
        const res = await updateInvoice({
          id: initInvoice._id,
          data: data,
        });
        toast({
          variant: "success",
          title: res.message,
        });
      } else {
        const res = await createInvoice(data);
        toast({
          variant: "success",
          title: res.message,
        });
      }
      router.push("/dashboard/invoices");
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
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter invoice number"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Invoice Type Field */}
            <FormField
              control={form.control}
              name="invoiceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Type</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select invoice type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Supplier">Supplier</SelectItem>
                      <SelectItem value="Client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conditionally show Supplier or Client based on invoiceType */}
            <FormField
              control={form.control}
              name="entityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {watchInvoiceType === "Supplier" ? "Supplier" : "Client"}
                  </FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            watchInvoiceType === "Supplier"
                              ? "Select supplier"
                              : "Select client"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {watchInvoiceType === "Supplier"
                        ? suppliers.map((supplier) => (
                            <SelectItem key={supplier._id} value={supplier._id}>
                              {supplier.name}
                            </SelectItem>
                          ))
                        : clients.map((client) => (
                            <SelectItem key={client._id} value={client._id}>
                              {client.name}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purchaseOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Order</FormLabel>
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
                          placeholder="Select a purchase order"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {purchaseOrders.map((po) => (
                        <SelectItem key={po._id} value={po._id}>
                          {po.orderNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Enter total amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paidAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paid Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Enter paid amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <SingleDatePicker
                    className="w-full"
                    selectedDate={field.value || undefined}
                    onDateChange={(date: Date | undefined) =>
                      field.onChange(date)
                    }
                  />
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
