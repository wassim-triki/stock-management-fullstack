// Page.tsx (Server-Side Page Component)

import PdfPreviewer from "@/components/PDFPreview";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import config from "@/lib/config";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Purchase Orders", link: "/dashboard/purchase-orders" },
  { title: "Print", link: "" },
];

type Props = {
  params: { purchaseOrderId: string };
};

export default function Page({ params }: Props) {
  const purchaseOrderId = params.purchaseOrderId;

  // Define the endpoint for the purchase order PDF (could be dynamic)
  const endpoint = `${config.apiUrl}/api/purchase-orders/print/${purchaseOrderId}`;

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        {/* Pass the id and endpoint to PdfPreviewer */}
        <PdfPreviewer endpoint={endpoint} />
      </div>
    </ScrollArea>
  );
}
