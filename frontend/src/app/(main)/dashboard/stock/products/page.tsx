import { ApiSearchFilter, Product, QueryParams } from "@/lib/types";
import { DataTable } from "@/components/tables/data-table";
import ContentPageLayout from "@/components/layouts/content-page-layout";
import { columns } from "@/components/tables/products-table/columns";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getProducts, getTotalProducts } from "@/api/product";
import { queryKeys } from "@/lib/constants";
import { SortFieldSelect } from "../../suppliers/page";

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
    queryKey: [queryKeys.products, queryParams],
    queryFn: () => getProducts(queryParams),
  });

  const total = await queryClient.fetchQuery({
    queryKey: [queryKeys.totalProducts],
    queryFn: getTotalProducts,
  });

  const pageCount = Math.ceil(total / limit);

  const dehydratedState = dehydrate(queryClient);

  const sortFields: SortFieldSelect[] = [
    { value: "updatedAt_desc", label: "Last updated", type: "desc" },
    { value: "updatedAt_asc", label: "Last updated", type: "asc" },
    { value: "price_desc", label: "Price", type: "desc" },
    { value: "price_asc", label: "Price", type: "asc" },
  ];
  const defaultSearchField = { value: "name", label: "Name" };
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
