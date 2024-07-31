import { getSupplierById } from "@/api/supplier";
import { SupplierForm } from "@/components/forms/supplier-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Suppliers", link: "/dashboard/suppliers" },
  { title: "Edit", link: "/dashboard/suppliers/edit" },
];

type PageProps = {
  params: { supplierId: string };
};

export default async function Page({ params }: PageProps) {
  const supplier = await getSupplierById(params.supplierId);
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <SupplierForm
          initSupplier={supplier}
          action="Save changes"
          description="Edit supplier information"
          title="Edit Supplier"
        />
      </div>
    </ScrollArea>
  );
}
