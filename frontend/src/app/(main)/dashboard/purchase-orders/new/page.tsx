import { getCategories } from "@/api/category";
import { getSuppliers } from "@/api/supplier";
import { getProducts } from "@/api/product";
import { ProductForm } from "@/components/forms/product-form";
import { SupplierForm } from "@/components/forms/supplier-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { queryKeys } from "@/lib/constants";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { PurchaseOrderForm } from "@/components/forms/purchase-order-form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Purchase Orders", link: "/dashboard/stock/purchase-orders" },
  { title: "Create", link: "" },
];

export default async function Page() {
  const queryClient = new QueryClient();

  const suppliers = await queryClient.fetchQuery({
    queryKey: [queryKeys.suppliers],
    queryFn: () => getSuppliers({ noFilters: true }),
  });

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <PurchaseOrderForm
          suppliers={suppliers}
          action="Create"
          description="Create a new purchase order"
          title="Create Purchase Order"
        />
      </div>
    </ScrollArea>
  );
}
