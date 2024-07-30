import ContentPageLayout from "@/components/layouts/content-page-layout";
import { getSuppliers, getTotalSuppliers } from "@/api/supplier";

import { queryKeys } from "@/lib/constants";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "@/components/tables/suppliers-table/columns";
import { ApiSearchFilter, QueryParams } from "@/lib/types";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Suppliers", link: "/dashboard/suppliers" },
];

type ParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};
export type SortFieldSelect = {
  value: string;
  label: string;
  type: "desc" | "asc";
};
export type SearchFieldSelect = {
  value: string;
  label: string;
};
export default async function Page({ searchParams }: ParamsProps) {
  const page = Number(searchParams.page) || 1;

  const limit = Number(searchParams.limit) || 5;
  // const search = searchParams.search?.toString() || "";
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
    queryKey: [queryKeys.suppliers, queryParams],
    queryFn: () => getSuppliers(queryParams),
  });

  const total = await queryClient.fetchQuery({
    queryKey: [queryKeys.totalSuppliers],
    queryFn: getTotalSuppliers,
  });

  const sortFields: SortFieldSelect[] = [
    { value: "updatedAt_desc", label: "Last updated", type: "desc" },
    { value: "updatedAt_asc", label: "Last updated", type: "asc" },
    { value: "name_desc", label: "Name", type: "desc" },
    { value: "name_asc", label: "Name", type: "asc" },
  ];
  const searchFields: SearchFieldSelect[] = [
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
  ];
  const pageCount = Math.ceil(total / limit);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ContentPageLayout
        breadcrumbItems={breadcrumbItems}
        addNewLink="/dashboard/suppliers/new"
        title={`Suppliers (${total})`}
        description="Manage suppliers"
      >
        <DataTable
          rQPrams={{
            queryKey: queryKeys.suppliers,
            queryFn: getSuppliers,
          }}
          defaultSearchKey="name"
          columns={columns}
          pageCount={pageCount}
          queryParams={queryParams}
          sortFields={sortFields}
          searchFields={searchFields}
        />
      </ContentPageLayout>
    </HydrationBoundary>
  );
}
