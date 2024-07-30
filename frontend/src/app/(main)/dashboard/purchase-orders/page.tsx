import { ApiSearchFilter, QueryParams } from "@/lib/types";
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
import { SearchFieldSelect, SortFieldSelect } from "../suppliers/page";

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
  const offset = (page - 1) * limit;

  const sort = "updatedAt_desc";

  const queryParams: QueryParams = {
    limit: limit.toString(),
    offset: offset.toString(),
    sort,
    ...searchParams,
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

  const sortFields: SortFieldSelect[] = [
    { value: "updatedAt_desc", label: "Last updated", type: "desc" },
    { value: "updatedAt_asc", label: "Last updated", type: "asc" },
    { value: "orderDate_desc", label: "Order date", type: "desc" },
    { value: "orderDate_asc", label: "Order date", type: "asc" },
    { value: "status_desc", label: "Status", type: "desc" },
    { value: "status_asc", label: "Status", type: "asc" },
  ];
  const defaultSearchField = { value: "orderNumber", label: "Order Number" };
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
          defaultSearchField={defaultSearchField}
          columns={columns}
          pageCount={pageCount}
          queryParams={queryParams}
          sortFields={sortFields}
        />
      </ContentPageLayout>
    </HydrationBoundary>
  );
}
