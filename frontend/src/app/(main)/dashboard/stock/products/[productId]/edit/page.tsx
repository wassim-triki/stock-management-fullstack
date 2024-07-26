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
  { title: "Procucts", link: "/dashboard/stock/products" },
  { title: "Create", link: "/dashboard/stock/products/create" },
];

type Props = {
  params: { productId: string };
};

export default async function Page({ params }: Props) {
  const productId = params.productId;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.products, productId],
    queryFn: () => getProductById(productId),
  });
  const categories = await queryClient.fetchQuery({
    queryKey: [queryKeys.categories],
    queryFn: () => getCategories({ noFilters: true }),
  });
  const suppliers = await queryClient.fetchQuery({
    queryKey: [queryKeys.suppliers],
    queryFn: () => getSuppliers({ noFilters: true }),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <HydrationBoundary state={dehydratedState}>
          <ProductForm
            categories={categories}
            suppliers={suppliers}
            productId={productId}
            action="Save Changes"
            description="Edit a product"
            title="Edit product"
          />
        </HydrationBoundary>
      </div>
    </ScrollArea>
  );
}
