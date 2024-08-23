"use client";
import * as z from "zod";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus, Trash } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { description } from "../admin-panel/charts/bar-graph";
import { Textarea } from "../ui/textarea";
import Link from "next/link";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";

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
  description: z
    .string()
    .max(50, "Description mus be less than 50 characters")
    .optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  title: string;
  description: string;
  action: string;
  categories: Category[];
  suppliers: Supplier[];
  initProduct?: Product;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  title,
  description,
  action,
  categories,
  suppliers,
  initProduct,
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialData: ProductFormValues = {
    name: initProduct?.name || "",
    category: initProduct?.category?._id || "",
    supplier: initProduct?.supplier?._id || "",
    price: initProduct?.price?.toString() || "",
    quantityInStock: initProduct?.quantityInStock?.toString() || "",
    description: initProduct?.description || "",
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      const productData = {
        ...data,
        price: Number(data.price),
        quantityInStock: Number(data.quantityInStock),
      };
      if (initProduct) {
        const res = await updateProduct({
          id: initProduct._id,
          data: productData,
        });
        toast({
          variant: "success",
          title: res.message,
        });
      } else {
        const res = await createProduct(productData);
        toast({
          variant: "success",
          title: res.message,
        });
      }
      router.push("/dashboard/products");
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Name" {...field} />
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
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <Button variant={"link"}>
                        <Link
                          className="flex items-center gap-2"
                          href={"/dashboard/categories/new"}
                        >
                          <Plus className="h-4 w-4" />
                          Add a new category
                        </Link>
                      </Button>
                      <DropdownMenuSeparator />
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
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a supplier"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <Button variant={"link"}>
                        <Link
                          className="flex items-center gap-2"
                          href={"/dashboard/suppliers/new"}
                        >
                          <Plus className="h-4 w-4" />
                          Add a new supplier
                        </Link>
                      </Button>
                      <DropdownMenuSeparator />
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
                      disabled={loading}
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
                      disabled={loading}
                      placeholder="Quantity In Stock"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Description"
                      className="resize-none"
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
