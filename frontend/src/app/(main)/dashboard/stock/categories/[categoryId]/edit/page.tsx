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
  { title: "Categories", link: "/dashboard/stock/categories" },
  { title: "Edit", link: "" },
];

type Props = {
  params: { categoryId: string };
};

export default async function Page({ params }: Props) {
  const categoryId = params.categoryId;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.categories, categoryId],
    queryFn: () => getCategoryById(categoryId),
  });
  const categories = await queryClient.fetchQuery({
    queryKey: [queryKeys.categories],
    queryFn: () => getCategories({ noFilters: true }),
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <HydrationBoundary state={dehydratedState}>
          <CategoryForm
            categories={categories}
            categoryId={categoryId}
            action="Save Changes"
            description="Edit supplier information"
            title="Edit Supplier"
          />
        </HydrationBoundary>
      </div>
    </ScrollArea>
  );
}
