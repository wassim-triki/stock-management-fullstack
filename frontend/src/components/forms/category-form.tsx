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
  categoryId?: string | undefined;
  categories: Category[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  title,
  description,
  action,
  categoryId = "",
  categories,
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: categoryData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.categories, categoryId],
    queryFn: () => getCategoryById(categoryId),
    enabled: !!categoryId,
  });

  const initialData: CategoryFormValues = {
    name: categoryData?.name || "",
    parentCategory: categoryData?.parentCategory?._id || "",
  };

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: updateCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.categories] });
      toast({
        variant: "success",
        title: data.message,
      });
      setOpen(false);
      router.push("/dashboard/stock/categories");
    },
    onError(error, variables, context) {
      toast({
        variant: "destructive",
        title: error.message,
      });
    },
  });

  const { mutate: deletee, isPending: isDeleting } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.categories],
      });
      toast({
        variant: "success",
        title: data.message,
      });
      setOpen(false);
      router.push("/dashboard/stock/categories");
    },
    onError(error, variables, context) {
      toast({
        variant: "destructive",
        title: error.message,
      });
    },
  });

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.categories] });
      toast({
        variant: "success",
        title: data.message,
      });
      setOpen(false);
      router.push("/dashboard/stock/categories");
    },
    onError(error, variables, context) {
      toast({
        variant: "destructive",
        title: error.message,
      });
    },
  });

  const allLoading = isCreating || isLoading || isUpdating || isDeleting;

  const defaultValues = initialData;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    // defaultValues,
    values: defaultValues,
  });

  const onSubmit = async (data: CategoryFormValues) => {
    setLoading(true);
    const parentCategory =
      data.parentCategory && data.parentCategory !== "none"
        ? data.parentCategory
        : null;
    if (initialData && params.categoryId) {
      update({
        id: params.categoryId as string,
        data: { ...data, parentCategory },
      });
    } else {
      create({ ...data, parentCategory });
    }
  };

  const onConfirmDelete = async () => {
    deletee(categoryId);
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
        {categoryData && (
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
                name="parentCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category</FormLabel>
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
