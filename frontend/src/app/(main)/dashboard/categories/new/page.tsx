import { getCategories, getCategoryById } from "@/api/category";
import { CategoryForm } from "@/components/forms/category-form";
import { SupplierForm } from "@/components/forms/supplier-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { queryKeys } from "@/lib/constants";
import { QueryClient } from "@tanstack/react-query";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Categories", link: "/dashboard/stock/categories" },
  { title: "Create", link: "" },
];

export default async function Page() {
  const queryClient = new QueryClient();
  const categories = await getCategories();
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <CategoryForm
          categories={categories}
          action="Create"
          description="Create a new category"
          title="Create Category"
        />
      </div>
    </ScrollArea>
  );
}
