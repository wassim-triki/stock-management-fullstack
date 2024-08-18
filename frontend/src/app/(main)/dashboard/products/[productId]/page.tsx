import { getCategories } from "@/api/category";
import { getProductById, getProducts } from "@/api/product";
import { getSuppliers } from "@/api/supplier";
import { ProductForm } from "@/components/forms/product-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { queryKeys } from "@/lib/constants";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Procucts", link: "/dashboard/products" },
  { title: "Create", link: "/dashboard/products/create" },
];

type Props = {
  params: { productId: string };
};

export default async function Page({ params }: Props) {
  const productId = params.productId;

  const product = await getProductById(productId);
  const categories = await getCategories();
  const suppliers = await getSuppliers();

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <ProductForm
          initProduct={product}
          categories={categories}
          suppliers={suppliers}
          action="Save Changes"
          description="Edit product information"
          title="Edit product"
        />
      </div>
    </ScrollArea>
  );
}
