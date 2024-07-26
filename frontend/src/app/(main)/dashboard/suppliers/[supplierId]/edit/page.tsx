import { SupplierForm } from "@/components/forms/supplier-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSupplierById } from "@/api/supplier";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Suppliers", link: "/dashboard/suppliers" },
  { title: "Edit", link: "" },
];

type Props = {
  params: { supplierId: string };
};

export default async function Page({ params }: Props) {
  const supplierId = params.supplierId;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.suppliers, supplierId],
    queryFn: () => getSupplierById(supplierId),
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <HydrationBoundary state={dehydratedState}>
          <SupplierForm
            // initialData={res.data}
            supplierId={supplierId}
            action="Save Changes"
            description="Edit supplier information"
            title="Edit Supplier"
          />
        </HydrationBoundary>
      </div>
    </ScrollArea>
  );
}
