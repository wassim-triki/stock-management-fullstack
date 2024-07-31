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
import { getPurchaseOrderById } from "@/api/purchase-order";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Purchase Orders", link: "/dashboard/purchase-orders" },
  { title: "Create", link: "" },
];
type Props = {
  params: { purchaseOrderId: string };
};
export default async function Page({ params }: Props) {
  const suppliers = await getSuppliers();
  const products = await getProducts();
  const purchaseOrder = await getPurchaseOrderById(params.purchaseOrderId);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <PurchaseOrderForm
          suppliers={suppliers}
          products={products}
          initPurchaseOrder={purchaseOrder}
          action="Save changes"
          description="Edit purchase order information"
          title="Edit Purchase Order"
        />
      </div>
    </ScrollArea>
  );
}
