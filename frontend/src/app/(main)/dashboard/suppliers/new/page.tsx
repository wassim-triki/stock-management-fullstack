import { SupplierForm } from "@/components/forms/supplier-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Suppliers", link: "/dashboard/suppliers" },
  { title: "Create", link: "/dashboard/suppliers/create" },
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
          description="Create a new supplier"
          title="Create Supplier"
        />
      </div>
    </ScrollArea>
  );
}
