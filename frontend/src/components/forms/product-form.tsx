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
import { useToast } from "../ui/use-toast";
import {
  createProduct,
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/api/product";
import { getCategories } from "@/api/category";
import { getSuppliers } from "@/api/supplier";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  Product,
  Category,
  Supplier,
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

const formSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  supplier: z.string().min(1, { message: "Supplier is required" }),
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
  quantityInStock: z
    .string()
    .min(1, { message: "Quantity is required" })
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num >= 0;
      },
      { message: "Quantity must be a positive number" },
    ),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  title: string;
  description: string;
  action: string;
  productId?: string | undefined;
  categories: Category[];
  suppliers: Supplier[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  title,
  description,
  action,
  productId = "",
  categories,
  suppliers,
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: productData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.products, productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });

  const initialData: ProductFormValues = {
    name: productData?.name || "",
    category: productData?.category?._id || "",
    supplier: productData?.supplier?._id || "",
    price: productData?.price?.toString() || "",
    quantityInStock: productData?.quantityInStock?.toString() || "",
  };

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.products] });
      toast({
        variant: "success",
        title: data.message,
      });
      setOpen(false);
      router.push("/dashboard/stock/products");
    },
    onError(error, variables, context) {
      toast({
        variant: "destructive",
        title: error.message,
      });
    },
  });

  const { mutate: deletee, isPending: isDeleting } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.products],
      });
      toast({
        variant: "success",
        title: data.message,
      });
      setOpen(false);
      router.push("/dashboard/stock/products");
    },
    onError(error, variables, context) {
      toast({
        variant: "destructive",
        title: error.message,
      });
    },
  });

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.products] });
      toast({
        variant: "success",
        title: data.message,
      });
      setOpen(false);
      router.push("/dashboard/stock/products");
    },
    onError(error, variables, context) {
      toast({
        variant: "destructive",
        title: error.message,
      });
    },
  });

  const allLoading = isCreating || isLoading || isUpdating || isDeleting;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: ProductFormValues) => {
    console.log(data);
    const category = data.category;
    const supplier = data.supplier;
    if (initialData && params.productId) {
      update({
        id: params.productId as string,
        data: {
          ...data,
          category,
          supplier,
          price: parseFloat(data.price),
          quantityInStock: parseInt(data.quantityInStock, 10),
        },
      });
    } else {
      create({
        ...data,
        category,
        supplier,
        price: parseFloat(data.price),
        quantityInStock: parseInt(data.quantityInStock, 10),
      });
    }
  };

  const onConfirmDelete = async () => {
    deletee(productId);
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
        {productData && (
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
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={allLoading}
                        placeholder="Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      disabled={allLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Category"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
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
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <Select
                      disabled={allLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Supplier"
                          />
                        </SelectTrigger>
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

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={allLoading}
                        placeholder="Price"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantityInStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity In Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={allLoading}
                        placeholder="Quantity In Stock"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div></div>

            <div className="w-full md:w-min">
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
