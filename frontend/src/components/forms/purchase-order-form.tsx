"use client";
import * as z from "zod";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Trash, PackagePlus, Plus } from "lucide-react";
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
  createPurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderById,
  updatePurchaseOrder,
} from "@/api/purchase-order";
import { getCategories } from "@/api/category";
import { getSuppliers } from "@/api/supplier";
import { getProductsBySupplier } from "@/api/product"; // New function to get products by supplier
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  PurchaseOrder,
  Category,
  Supplier,
  Product,
} from "@/lib/types";
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
import Link from "next/link";

const formSchema = z.object({
  supplier: z.string().min(1, { message: "Supplier is required" }),
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
      price: z
        .string()
        .min(1, { message: "Price is required" })
        .refine(
          (val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num >= 0;
          },
          { message: "Price must be a positive number" },
        ),
    }),
  ),
});

type PurchaseOrderFormValues = z.infer<typeof formSchema>;

interface PurchaseOrderFormProps {
  title: string;
  description: string;
  action: string;
  purchaseOrderId?: string | undefined;
  suppliers: Supplier[];
}

export const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
  title,
  description,
  action,
  purchaseOrderId = "",
  suppliers,
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: purchaseOrderData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.purchaseOrders, purchaseOrderId],
    queryFn: () => getPurchaseOrderById(purchaseOrderId),
    enabled: !!purchaseOrderId,
  });

  const initialData: PurchaseOrderFormValues = {
    supplier: purchaseOrderData?.supplier || "",
    items: purchaseOrderData?.items.map((item) => ({
      product: item.product,
      quantity: item.quantity.toString(),
      price: item.price.toString(),
    })) || [{ product: "", quantity: "", price: "" }],
  };

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: updatePurchaseOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.purchaseOrders] });
      toast({
        variant: "success",
        title: data.message,
      });
      setOpen(false);
      router.push("/dashboard/stock/purchase-orders");
    },
    onError(error, variables, context) {
      toast({
        variant: "destructive",
        title: error.message,
      });
    },
  });

  const { mutate: deletee, isPending: isDeleting } = useMutation({
    mutationFn: deletePurchaseOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.purchaseOrders],
      });
      toast({
        variant: "success",
        title: data.message,
      });
      setOpen(false);
      router.push("/dashboard/stock/purchase-orders");
    },
    onError(error, variables, context) {
      toast({
        variant: "destructive",
        title: error.message,
      });
    },
  });

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.purchaseOrders] });
      toast({
        variant: "success",
        title: data.message,
      });
      setOpen(false);
      router.push("/dashboard/purchase-orders");
    },
    onError(error, variables, context) {
      toast({
        variant: "destructive",
        title: error.message,
      });
    },
  });

  const allLoading = isCreating || isLoading || isUpdating || isDeleting;

  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const { data: productsBySupplier, refetch: refetchProductsBySupplier } =
    useQuery({
      queryKey: [queryKeys.products, form.getValues("supplier")],
      queryFn: () => getProductsBySupplier(form.getValues("supplier")),
    });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    replace({
      product: "",
      quantity: "",
      price: "",
    });
  }, [form.getValues("supplier")]);
  useEffect(() => {
    form.setValue("supplier", "");
  }, []);
  useEffect(() => {
    console.log(productsBySupplier);
  }, [form.getValues("supplier")]);

  const handleSupplierChange = async (supplierId: string) => {
    console.log(supplierId);
    form.setValue("supplier", supplierId);
    if (supplierId) {
      await refetchProductsBySupplier();
    }
  };

  const handleProductChange = async (productId: string) => {
    const index = productsBySupplier
      ?.map((p) => p._id)
      .findIndex((value) => value === productId);
    console.log(productId, index);
    if (productId === "add") router.push("/dashboard/stock/products/new");
    if (index) {
      form.setValue(`items.${index}.product`, productId);
    }
  };

  const onSubmit = async (data: PurchaseOrderFormValues) => {
    console.log(data);
    const supplier = data.supplier;
    const items = data.items.map((item) => ({
      ...item,
      quantity: parseInt(item.quantity, 10),
      price: parseFloat(item.price),
    }));
    if (initialData && params.purchaseOrderId) {
      update({
        id: params.purchaseOrderId as string,
        data: { ...data, supplier, items },
      });
    } else {
      // console.log("Will create with:", { ...data, supplier, items });
      create({ ...data, supplier, items });
    }
  };

  const onConfirmDelete = async () => {
    deletee(purchaseOrderId);
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
        {purchaseOrderData && (
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
      {isError && <div>{error?.message}</div>}
      {!isError && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-8">
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <Select
                        disabled={allLoading}
                        onValueChange={handleSupplierChange}
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
                              {/* TODO: show emails in dropdown and only name when selected */}
                              {/* <div className="flex flex-col gap-1">
                                <div>{supplier.name}</div>
                                <div className="text-sx text-slate-400">
                                  {supplier.email}
                                </div>
                              </div> */}
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
              {/* <Button
                  variant="secondary"
                  onClick={() =>
                    append({ product: "", quantity: "", price: "" })
                  }
                  disabled={allLoading}
                >
                  Add Item
                </Button> */}
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
                  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name={`items.${index}.product`}
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel>Product</FormLabel> */}
                          <Select
                            disabled={allLoading}
                            // onValueChange={(value) =>
                            //   handleProductChange(value)
                            // }
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <div className="flex items-center gap-4">
                                {/* <Button
                                    onClick={() =>
                                      append({
                                        product: "",
                                        quantity: "",
                                        price: "",
                                      })
                                    }
                                    type="button"
                                    variant="outline"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button> */}
                                <SelectTrigger>
                                  <SelectValue
                                    defaultValue={field.value}
                                    placeholder="Select a product"
                                  />
                                </SelectTrigger>
                                {/* <Button variant="default">
                                    <Link
                                      href={"/dashboard/stock/products/new"}
                                    >
                                      <PackagePlus className="h-4 w-4" />
                                    </Link>
                                  </Button> */}
                              </div>
                            </FormControl>
                            <SelectContent>
                              {/* <SelectItem key="add" value="add">
                                  <Link
                                    href={"/dashboard/stock/products/new"}
                                    className="flex items-center justify-start gap-2"
                                  >
                                    <PackagePlus className="h-4 w-4" />
                                    Add a new product
                                  </Link>
                                </SelectItem> */}
                              {productsBySupplier?.map((product) => (
                                <SelectItem
                                  key={product._id}
                                  value={product._id}
                                >
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
                          {/* <FormLabel>Quantity</FormLabel> */}
                          <FormControl>
                            <Input
                              type="number"
                              disabled={allLoading}
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
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel>Price</FormLabel> */}
                          <FormControl>
                            <div className="flex items-center gap-4">
                              <Input
                                type="number"
                                disabled={allLoading}
                                placeholder="Price"
                                {...field}
                              />

                              {fields.length > 1 && (
                                <Button
                                  variant="destructive"
                                  // size="sm"
                                  className="msb-[2px] mt-auto"
                                  onClick={() => remove(index)}
                                  disabled={allLoading}
                                >
                                  <Trash className="h-4 w-4" />
                                  {/* Remove */}
                                </Button>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          append({ product: "", quantity: "", price: "" })
                        }
                        disabled={allLoading}
                      >
                        Add Item
                      </Button> */}
                </div>
              ))}
            </div>
            <Button
              onClick={() =>
                append({
                  product: "",
                  quantity: "",
                  price: "",
                })
              }
              type="button"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <div className="w-full md:w-min">
              <SubmitButton
                // disabled={!productsBySupplier || productsBySupplier.length <= 0}
                loading={allLoading}
                type="submit"
              >
                {action}
              </SubmitButton>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};
