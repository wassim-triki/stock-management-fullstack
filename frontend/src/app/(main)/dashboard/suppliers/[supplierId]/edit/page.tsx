import { SupplierForm } from "@/components/forms/supplier-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSupplierById } from "@/api/supplier";
import { Supplier, ApiErrorResponse } from "@/lib/types";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Suppliers", link: "/dashboard/suppliers" },
  { title: "Edit", link: "" },
];

type Props = {
  params: { supplierId: string };
};

export default async function Page({ params }: Props) {
  const supplierId = params.supplierId as string;

  try {
    const res = await getSupplierById(supplierId);

    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-8">
          <Breadcrumbs items={breadcrumbItems} />
          <SupplierForm
            initialData={res.data}
            action="Save Changes"
            description="Edit supplier information"
            title="Edit Supplier"
          />
        </div>
      </ScrollArea>
    );
  } catch (error) {
    console.error(error);

    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-8">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-center justify-center py-48 text-slate-500">
            {(error as ApiErrorResponse).message ||
              "An error occurred while fetching the supplier data."}
          </div>
        </div>
      </ScrollArea>
    );
  }
}
