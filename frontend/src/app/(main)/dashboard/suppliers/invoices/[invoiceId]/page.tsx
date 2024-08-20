import { getPurchaseOrders } from "@/api/purchase-order";
import { getSupplierById } from "@/api/supplier";
import { getSupplierInvoiceById } from "@/api/supplier-invoices";
import { SupplierForm } from "@/components/forms/supplier-form";
import { SupplierInvoiceForm } from "@/components/forms/supplier-invoice-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Suppliers", link: "/dashboard/suppliers" },
  { title: "Invoices", link: "/dashboard/suppliers/invoices" },
  { title: "Edit", link: "" },
];

type PageProps = {
  params: { invoiceId: string };
};

export default async function Page({ params }: PageProps) {
  const purcahseOrders = await getPurchaseOrders();
  const invoice = await getSupplierInvoiceById(params.invoiceId);
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <SupplierInvoiceForm
          purchaseOrders={purcahseOrders}
          initSupplierInvoice={invoice}
          action="Save changes"
          description="Edit supplier invoice"
          title="Edit Supplier Invoice"
        />
      </div>
    </ScrollArea>
  );
}
