"use client";
import * as z from "zod";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Trash, PackagePlus, Plus, SendHorizontal, Send } from "lucide-react";
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
  createPurchaseOrder,
  previewPurchaseOrderPdf,
  updatePurchaseOrder,
} from "@/api/purchase-order";
import {
  PurchaseOrder,
  Supplier,
  Product,
  ApiErrorResponse,
} from "@/lib/types";
import SubmitButton from "../ui/submit-button";
import { PO_STATUSES } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Link from "next/link";
import { SingleDatePicker } from "../ui/single-date-picker";
import fetchHelper from "@/lib/fetchInstance";
import config from "@/lib/config";

const formSchema = z.object({
  status: z.string().min(1, { message: "Status is required" }),
  supplier: z.string().min(1, { message: "Supplier is required" }),
  orderDate: z.date().optional(),
  items: z.array(
    z.object({
      product: z.string().min(1, { message: "Product is required" }),
      quantity: z
        .string()
        .min(1, { message: "Quantity is required" })
        .refine(
          (val) => {
            const num = parseInt(val, 10);
            return !isNaN(num) && num > 0;
          },
          { message: "Quantity must be a positive number" },
        ),
      unitPrice: z
        .string()
        .min(1, { message: "Unit price is required" })
        .refine(
          (val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num >= 0;
          },
          { message: "Price must be a positive number" },
        ),
      lineTotal: z.string(),
    }),
  ),
  orderTotal: z.string(),
});

type PurchaseOrderFormValues = z.infer<typeof formSchema>;

interface PurchaseOrderFormProps {
  title: string;
  description: string;
  action: string;
  purchaseOrderId?: string | undefined;
  suppliers: Supplier[];
  products: Product[];
  initPurchaseOrder?: PurchaseOrder;
}

export const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
  title,
  description,
  action,
  purchaseOrderId = "",
  suppliers,
  products,
  initPurchaseOrder,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const initialData: PurchaseOrderFormValues = {
    status: initPurchaseOrder?.status || "Pending",
    supplier: initPurchaseOrder?.supplier?._id || "",
    orderDate: initPurchaseOrder?.orderDate
      ? new Date(initPurchaseOrder.orderDate)
      : new Date(),
    orderTotal: initPurchaseOrder?.orderTotal?.toString() || "0",
    items: initPurchaseOrder?.items.map((item) => ({
      product: item.product?._id,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      lineTotal: (item.quantity * item.unitPrice).toString(),
    })) || [{ product: "", quantity: "", unitPrice: "", lineTotal: "0" }],
  };

  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Watch for changes in the "items" array's quantity and price fields
  const watchedItems = useWatch({
    control: form.control,
    name: "items",
  });

  // Calculate lineTotal and orderTotal whenever quantity or price changes
  useEffect(() => {
    let newOrderTotal = 0;

    watchedItems.forEach((item, index) => {
      const quantity = parseFloat(item.quantity || "0");
      const price = parseFloat(item.unitPrice || "0");
      const lineTotal = quantity * price;

      if (!isNaN(lineTotal)) {
        // Only update if the value actually changes to avoid unnecessary re-renders
        const currentLineTotal = form.getValues(`items.${index}.lineTotal`);
        if (lineTotal.toFixed(2) !== currentLineTotal) {
          form.setValue(`items.${index}.lineTotal`, lineTotal.toFixed(2), {
            shouldValidate: false,
            shouldDirty: true,
          });
        }
        newOrderTotal += lineTotal;
      }
    });

    form.setValue("orderTotal", newOrderTotal.toFixed(2), {
      shouldValidate: false,
      shouldDirty: true,
    });
  }, [watchedItems, form]);

  const onSubmit = async (data: PurchaseOrderFormValues) => {
    setLoading(true);
    const items = data.items.map((item) => ({
      ...item,
      quantity: parseInt(item.quantity, 10),
      price: parseFloat(item.unitPrice),
    }));
    try {
      if (initPurchaseOrder) {
        const res = await updatePurchaseOrder({
          id: initPurchaseOrder._id,
          data: { ...data, items },
        });
        toast({
          variant: "success",
          title: res.message,
        });
      } else {
        const pdfBlobRes = await previewPurchaseOrderPdf(data);
        // Create a blob URL from the PDF data
        const pdfBlob = new Blob([await pdfBlobRes.blob()], {
          type: "application/pdf",
        });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        console.log(pdfUrl);
        setPdfUrl(pdfUrl);
        // const res = await createPurchaseOrder({ ...data, supplier, items });
        // toast({
        //   variant: "success",
        //   title: res.message,
        // });
      }
      // router.push("/dashboard/purchase-orders");
    } catch (error) {
      toast({
        variant: "destructive",
        title: (error as ApiErrorResponse).message,
      });
    } finally {
      setLoading(false);
    }
  };

  async function handleSend() {
    try {
      setLoading(true);
      const values = form.getValues();
      const items = form.getValues("items").map((item) => ({
        ...item,
        quantity: parseInt(item.quantity, 10),
        price: parseFloat(item.unitPrice),
      }));
      const res = await createPurchaseOrder({ ...values, items });
      console.log(res.data);
      toast({
        variant: "success",
        title: res.message,
        description: "Email sent to " + res.data.supplier.email,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: (error as ApiErrorResponse).message,
      });
    } finally {
      setLoading(false);
    }
  }

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
          <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:gap-8">
            <div className="md:col-span-1">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
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
                            placeholder="Select a status"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PO_STATUSES.map((status) => (
                          <SelectItem key={status.name} value={status.name}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-1">
              <FormField
                control={form.control}
                name="orderDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Date</FormLabel>
                    <SingleDatePicker
                      className="w-full"
                      fromDate={new Date()}
                      selectedDate={field.value || new Date() || undefined}
                      onDateChange={(date: Date | undefined) =>
                        field.onChange(date)
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
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
                              placeholder="Select a supplier"
                            />
                          </SelectTrigger>

                          <Link href={"/dashboard/suppliers/new"}>
                            <Button
                              className="flex items-center gap-2"
                              variant="secondary"
                            >
                              <Plus className="h-4 w-4" />
                              <span className="hidden sm:block">
                                Add new supplier
                              </span>
                            </Button>
                          </Link>
                        </div>
                      </FormControl>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier._id} value={supplier._id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-8">
            <Separator />
            <Button variant="secondary">
              <Link
                className="flex items-center gap-2"
                href={"/dashboard/stock/products/new"}
              >
                <PackagePlus className="h-4 w-4" />
                Add a new product
              </Link>
            </Button>
            {fields.map((item, index) => (
              <div key={item.id} className="flex gap-4">
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-4">
                  <FormField
                    control={form.control}
                    name={`items.${index}.product`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
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
                                  placeholder="Select a product"
                                />
                              </SelectTrigger>
                            </div>
                          </FormControl>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product._id} value={product._id}>
                                {product.name}
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
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={loading}
                            placeholder="Quantity"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={loading}
                            placeholder="Unit price"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.lineTotal`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Line total</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Input
                              type="number"
                              disabled
                              placeholder="Line total"
                              {...field}
                            />
                            {fields.length > 1 && (
                              <Button
                                variant="destructive"
                                className="msb-[2px] mt-auto"
                                onClick={() => remove(index)}
                                disabled={loading}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              onClick={() =>
                append({
                  product: "",
                  quantity: "",
                  unitPrice: "",
                  lineTotal: "0",
                })
              }
              type="button"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <FormField
              control={form.control}
              name={`orderTotal`}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel className="w-fit">Total:</FormLabel>
                  <FormControl>
                    <Input
                      className="!m-0"
                      type="number"
                      disabled
                      placeholder="Order total"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full md:w-min">
            <SubmitButton loading={loading} type="submit">
              Preview order
            </SubmitButton>
          </div>
        </form>
      </Form>
      {pdfUrl && (
        <>
          <iframe
            src={pdfUrl}
            width="100%"
            height="500px"
            title="PDF Preview"
          ></iframe>
          <Button
            loading={loading}
            className="flex w-full gap-2 md:w-min"
            onClick={handleSend}
          >
            <Send className="h-4 w-4" />
            Send
          </Button>
        </>
      )}
    </>
  );
};
