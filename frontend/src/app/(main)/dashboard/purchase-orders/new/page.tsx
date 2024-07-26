import { getCategories, getCategoryById } from "@/api/category";
import { getSuppliers } from "@/api/supplier";
import { CategoryForm } from "@/components/forms/category-form";
import { ProductForm } from "@/components/forms/product-form";
import { SupplierForm } from "@/components/forms/supplier-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { queryKeys } from "@/lib/constants";
import { dehydrate, QueryClient } from "@tanstack/react-query";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Purchase Orders", link: "/dashboard/purchase-orders" },
  { title: "Create", link: "" },
];

export default async function Page() {
  const queryClient = new QueryClient();

  // const categories = await queryClient.fetchQuery({
  //   queryKey: [queryKeys.categories],
  //   queryFn: () => getCategories({ noFilters: true }),
  // });
  // const suppliers = await queryClient.fetchQuery({
  //   queryKey: [queryKeys.suppliers],
  //   queryFn: () => getSuppliers({ noFilters: true }),
  // });

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        {/* <ProductForm
          suppliers={suppliers}
          categories={categories}
          action="Create"
          description="Create a new product"
          title="Create Product"
        /> */}
        Purchase order form
      </div>
    </ScrollArea>
  );
}
