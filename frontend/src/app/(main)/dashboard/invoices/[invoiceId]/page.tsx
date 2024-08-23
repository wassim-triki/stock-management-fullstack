import { getPurchaseOrders } from "@/api/purchase-order";
import { getSuppliers } from "@/api/supplier";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { InvoiceForm } from "@/components/forms/invoice-form";
import { getInvoiceById } from "@/api/invoice";
import { getClients } from "@/api/client";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Invoices", link: "/dashboard/invoices" },
  { title: "Edit", link: "" },
];

type PageProps = {
  params: { invoiceId: string };
};

export default async function Page({ params }: PageProps) {
  const purchaseOrders = await getPurchaseOrders();
  const suppliers = await getSuppliers();
  const clients = await getClients(); // Fetch clients
  const invoice = await getInvoiceById(params.invoiceId);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <InvoiceForm
          purchaseOrders={purchaseOrders}
          initInvoice={invoice}
          suppliers={suppliers}
          clients={clients} // Pass clients to the form
          action="Save changes"
          description="Edit invoice"
          title="Edit Invoice"
        />
      </div>
    </ScrollArea>
  );
}
