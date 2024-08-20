import { getSuppliers } from "@/api/supplier";
import { getProducts } from "@/api/product";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPurchaseOrders } from "@/api/purchase-order";
import { SupplierInvoiceForm } from "@/components/forms/supplier-invoice-form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Suppliers", link: "/dashboard/suppliers" },
  { title: "Invoices", link: "/dashboard/suppliers/invoices" },
  { title: "Create", link: "/dashboard/suppliers/invoices/new" },
];

export default async function Page() {
  const purcahseOrders = await getPurchaseOrders();

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <SupplierInvoiceForm
          purchaseOrders={purcahseOrders}
          action="Create"
          description="Create a new supplier invoice"
          title="Create Supplier Invoice"
        />
      </div>
    </ScrollArea>
  );
}
