// Page.tsx (Server-Side Page Component)

import {
  fetchPurchaseOrderPdf,
  getPurchaseOrderById,
  sendPurchaseOrder,
} from "@/api/purchase-order";
import PurchaseOrderPreview from "@/components/purchase-order-preview";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Purchase Orders", link: "/dashboard/purchase-orders" },
  { title: "Print", link: "" },
];

type Props = {
  params: { purchaseOrderId: string };
};

export default async function Page({ params }: Props) {
  const purchaseOrderId = params.purchaseOrderId;
  const { orderNumber } = await getPurchaseOrderById(purchaseOrderId);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        {/* Pass the sendAction and fetchPdfAction */}
        <PurchaseOrderPreview
          filename={`purchase_order_${orderNumber}.pdf`}
          id={purchaseOrderId}
        />
      </div>
    </ScrollArea>
  );
}
