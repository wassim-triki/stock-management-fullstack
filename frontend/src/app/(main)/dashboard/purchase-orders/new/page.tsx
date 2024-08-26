import { getSuppliers } from "@/api/supplier";
import { getProducts } from "@/api/product";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PurchaseOrderForm } from "@/components/forms/purchase-order-form";
import { getClients } from "@/api/client";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Purchase Orders", link: "/dashboard/purchase-orders" },
  { title: "Create", link: "" },
];

export default async function Page() {
  const suppliers = await getSuppliers();
  const products = await getProducts();
  const clients = await getClients();

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <PurchaseOrderForm
          suppliers={suppliers}
          products={products}
          clients={clients}
          action="Create"
          description="Create a new purchase order"
          title="Create Purchase Order"
        />
      </div>
    </ScrollArea>
  );
}
