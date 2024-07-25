import { SupplierForm } from "@/components/forms/supplier-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Procucts", link: "/dashboard/products" },
  { title: "Create", link: "/dashboard/products/create" },
];

export default function Page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <SupplierForm
          // categories={[
          //   { _id: "shirts", name: "shirts" },
          //   { _id: "pants", name: "pants" },
          // ]}
          action="Create"
          description="Create a new product"
          title="Create product"
        />
      </div>
    </ScrollArea>
  );
}
