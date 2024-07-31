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
  createCategory,
  deleteCategory,
  getCategoryById,
  updateCategory,
} from "@/api/category";
import { ApiErrorResponse, ApiSuccessResponse, Category } from "@/lib/types";
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
  name: z.string().min(1, { message: "Category name is required" }),
  parentCategory: z.string(),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  title: string;
  description: string;
  action: string;
  categories: Category[];
  initCategory: Category;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  title,
  description,
  action,
  categories,
  initCategory,
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    name: initCategory.name || "",
    parentCategory: initCategory?.parentCategory?._id || "",
  };

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    // defaultValues,
    values: defaultValues,
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      const parentCategory =
        data.parentCategory && data.parentCategory !== "none"
          ? data.parentCategory
          : null;
      if (initCategory) {
        const res = await updateCategory({
          id: initCategory._id,
          data: { ...data, parentCategory },
        });
        toast({
          variant: "success",
          title: res.message,
        });
      } else {
        const res = await createCategory({ ...data, parentCategory });
        toast({
          variant: "success",
          title: res.message,
        });
      }
      router.push("/dashboard/categories");
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
                    <Input disabled={loading} placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
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
                          placeholder="Parent Category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* @ts-ignore */}
                      <SelectItem key={"none"} value={"none"}>
                        None
                      </SelectItem>
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
          </div>
          <div></div>

          <div className="w-full md:w-min">
            <SubmitButton loading={loading} type="submit">
              {action}
            </SubmitButton>
          </div>
        </form>
      </Form>
    </>
  );
};
