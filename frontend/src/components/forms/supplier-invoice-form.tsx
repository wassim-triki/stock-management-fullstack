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

import { PurchaseOrder, SupplierInvoice, ApiErrorResponse } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SingleDatePicker } from "../ui/single-date-picker";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import {
  createSupplierInvoice,
  updateSupplierInvoice,
} from "@/api/supplier-invoices";
import { PAYMENT_STATUSES } from "@/constants/payment-statuses";

// Zod validation schema for the form
const formSchema = z.object({
  invoiceNumber: z.string().min(1, { message: "Invoice number is required" }),
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

export type SupplierInvoiceFormValues = z.infer<typeof formSchema>;

interface SupplierInvoiceFormProps {
  title: string;
  description: string;
  action: string;
  supplierInvoiceId?: string | undefined;
  purchaseOrders: PurchaseOrder[];
  purchaseOrder?: PurchaseOrder;
  initSupplierInvoice?: SupplierInvoice;
}

export const SupplierInvoiceForm: React.FC<SupplierInvoiceFormProps> = ({
  title,
  description,
  action,
  supplierInvoiceId = "",
  purchaseOrders,
  purchaseOrder,
  initSupplierInvoice,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const initialData: SupplierInvoiceFormValues = {
    invoiceNumber: initSupplierInvoice?.invoiceNumber || "",
    purchaseOrder:
      purchaseOrder?._id || initSupplierInvoice?.purchaseOrder?._id || "",
    totalAmount:
      purchaseOrder?.orderTotal.toString() ||
      initSupplierInvoice?.totalAmount?.toString() ||
      "0",
    paidAmount: initSupplierInvoice?.paidAmount?.toString() || "0",
    dueDate:
      purchaseOrder?.orderDate ||
      (initSupplierInvoice?.dueDate
        ? new Date(initSupplierInvoice.dueDate)
        : new Date()),
  };

  const form = useForm<SupplierInvoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SupplierInvoiceFormValues) => {
    setLoading(true);
    try {
      if (initSupplierInvoice) {
        const res = await updateSupplierInvoice({
          id: initSupplierInvoice._id,
          data: data,
        });
        toast({
          variant: "success",
          title: res.message,
        });
      } else {
        const res = await createSupplierInvoice(data);
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
        {" "}
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
                  <FormMessage />
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
                  <FormMessage />
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

            <Button className="w-full md:w-min" loading={loading} type="submit">
              {action}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
