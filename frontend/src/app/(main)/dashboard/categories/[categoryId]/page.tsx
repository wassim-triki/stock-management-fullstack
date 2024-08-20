import { SupplierForm } from "@/components/forms/supplier-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSupplierById } from "@/api/supplier";
import { Supplier, ApiErrorResponse } from "@/lib/types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants";
import { getCategories, getCategoryById } from "@/api/category";
import { CategoryForm } from "@/components/forms/category-form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Categories", link: "/dashboard/categories" },
  { title: "Edit", link: "" },
];

type Props = {
  params: { categoryId: string };
};

export default async function Page({ params }: Props) {
  const categoryId = params.categoryId;

  const category = await getCategoryById(categoryId);
  const categories = await getCategories();
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <CategoryForm
          categories={categories}
          initCategory={category}
          action="Save Changes"
          description="Edit category information"
          title="Edit Category"
        />
      </div>
    </ScrollArea>
  );
}
