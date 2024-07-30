import ContentPageLayout from "@/components/layouts/content-page-layout";

import { queryKeys } from "@/lib/constants";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { DataTable } from "@/components/tables/data-table";
import { getCategories, getTotalCategories } from "@/api/category";
import { columns } from "@/components/tables/categories-table/columns";
import { ApiSearchFilter, QueryParams } from "@/lib/types";
import { SortFieldSelect } from "../../suppliers/page";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Categories", link: "/dashboard/stock/categories" },
];

type ParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: ParamsProps) {
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
    queryKey: [queryKeys.categories, queryParams],
    queryFn: () => getCategories(queryParams),
  });

  const total = await queryClient.fetchQuery({
    queryKey: [queryKeys.totalCategoreis],
    queryFn: getTotalCategories,
  });

  const pageCount = Math.ceil(total / limit);

  const dehydratedState = dehydrate(queryClient);
  const sortFields: SortFieldSelect[] = [
    { value: "updatedAt_desc", label: "Last updated", type: "desc" },
    { value: "updatedAt_asc", label: "Last updated", type: "asc" },
    { value: "name_desc", label: "Name", type: "desc" },
    { value: "name_asc", label: "Name", type: "asc" },
  ];
  const defaultSearchField = { value: "name", label: "Name" };
  return (
    <HydrationBoundary state={dehydratedState}>
      <ContentPageLayout
        breadcrumbItems={breadcrumbItems}
        addNewLink="/dashboard/stock/categories/new"
        title={`Categories (${total})`}
        description="Manage categories"
      >
        <DataTable
          rQPrams={{
            queryKey: queryKeys.categories,
            queryFn: getCategories,
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
