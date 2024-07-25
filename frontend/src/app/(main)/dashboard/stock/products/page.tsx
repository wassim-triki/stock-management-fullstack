import { Product } from "@/lib/types";
import { DataTable } from "@/components/tables/data-table";
import ContentPageLayout from "@/components/layouts/content-page-layout";
import { columns } from "@/components/tables/products-table/columns";
import { ApiSearchFilter } from "@/api/supplier";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getProducts, getTotalProducts } from "@/api/product";
import { queryKeys } from "@/lib/constants";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Products", link: "/dashboard/stock/products" },
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;

  const limit = Number(searchParams.limit) || 5;
  const search = searchParams.search?.toString() || "";
  // const offset = (page - 1) * limit;

  const filter: ApiSearchFilter = {
    limit,
    page,
    search,
  };
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.products, filter],
    queryFn: () => getProducts(filter),
  });

  const total = await queryClient.fetchQuery({
    queryKey: [queryKeys.totalProducts],
    queryFn: getTotalProducts,
  });

  const pageCount = Math.ceil(total / limit);

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <ContentPageLayout
        breadcrumbItems={breadcrumbItems}
        addNewLink="/dashboard/stock/products/new"
        title={`Products (${total})`}
        description="Manage products"
      >
        <DataTable
          rQPrams={{
            queryKey: queryKeys.products,
            queryFn: getProducts,
          }}
          searchKey="name"
          columns={columns}
          pageCount={pageCount}
          filter={filter}
        />
      </ContentPageLayout>
    </HydrationBoundary>
  );
}
