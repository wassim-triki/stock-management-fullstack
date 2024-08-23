import { getSuppliers } from "@/api/supplier";
import { getProducts } from "@/api/product";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPurchaseOrderById, getPurchaseOrders } from "@/api/purchase-order";
import { InvoiceForm } from "@/components/forms/invoice-form";
import { getClients } from "@/api/client";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Invoices", link: "/dashboard/invoices" },
  { title: "Create", link: "/dashboard/invoices/new" },
];

type PageProps = {
  searchParams: {
    purchaseOrderId: string;
  };
};

export default async function Page({ searchParams }: PageProps) {
  const { purchaseOrderId } = searchParams;

  // Fetch suppliers, clients, and purchase orders
  const suppliers = await getSuppliers();
  const clients = await getClients(); // Assuming you have this implemented
  const purchaseOrders = await getPurchaseOrders();

  let purchaseOrder;
  if (purchaseOrderId)
    purchaseOrder = await getPurchaseOrderById(purchaseOrderId);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <InvoiceForm
          purchaseOrders={purchaseOrders}
          purchaseOrder={purchaseOrder}
          suppliers={suppliers}
          clients={clients} // Pass clients to the form
          action="Create"
          description="Create a new invoice"
          title="Create Invoice"
        />
      </div>
    </ScrollArea>
  );
}
