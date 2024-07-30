import { ApiSearchFilter } from "@/lib/types";
import { DataTable } from "@/components/tables/data-table";
import ContentPageLayout from "@/components/layouts/content-page-layout";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getTotalProducts } from "@/api/product";
import { queryKeys } from "@/lib/constants";
import {
  getPurchaseOrders,
  getTotalPurchaseOrders,
} from "@/api/purchase-order";
import { columns } from "@/components/tables/purchase-orders-table/columns";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Purchase Order", link: "/dashboard/purchase-orders" },
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
  const offset = (page - 1) * limit;

  const queryParams = { offset, limit, ...searchParams };

  console.log(queryParams);

  const filter: ApiSearchFilter = {
    limit,
    page,
    search,
  };
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.purchaseOrders, queryParams],
    queryFn: () => getPurchaseOrders(queryParams),
  });

  const total = await queryClient.fetchQuery({
    queryKey: [queryKeys.totalPurchaseOrders],
    queryFn: getTotalPurchaseOrders,
  });

  const pageCount = Math.ceil(total / limit);

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <ContentPageLayout
        breadcrumbItems={breadcrumbItems}
        addNewLink="/dashboard/purchase-orders/new"
        title={`Purchase Orders (${total})`}
        description="Manage purchase orders"
      >
        <DataTable
          rQPrams={{
            queryKey: queryKeys.purchaseOrders,
            queryFn: getPurchaseOrders,
          }}
          defaultSearchKey="orderNumber"
          columns={columns}
          pageCount={pageCount}
          queryParams={queryParams}
        />
      </ContentPageLayout>
    </HydrationBoundary>
  );
}
