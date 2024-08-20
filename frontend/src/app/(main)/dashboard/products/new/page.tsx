import { getCategories } from "@/api/category";
import { getSuppliers } from "@/api/supplier";
import { ProductForm } from "@/components/forms/product-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Products", link: "/dashboard/products" },
  { title: "Create", link: "" },
];

export default async function Page() {
  const categories = await getCategories();
  const suppliers = await getSuppliers();

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <ProductForm
          suppliers={suppliers}
          categories={categories}
          action="Create"
          description="Create a new product"
          title="Create Product"
        />
      </div>
    </ScrollArea>
  );
}
