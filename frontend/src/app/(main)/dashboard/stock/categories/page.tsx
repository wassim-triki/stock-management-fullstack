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
import { ApiSearchFilter } from "@/lib/types";

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
  const search = searchParams.search?.toString() || "";
  // const offset = (page - 1) * limit;

  const filter: ApiSearchFilter = {
    limit,
    page,
    search,
  };
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.categories, filter],
    queryFn: () => getCategories(filter),
  });

  const total = await queryClient.fetchQuery({
    queryKey: [queryKeys.totalCategoreis],
    queryFn: getTotalCategories,
  });

  const pageCount = Math.ceil(total / limit);

  const dehydratedState = dehydrate(queryClient);

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
          searchKey="name"
          columns={columns}
          pageCount={pageCount}
          filter={filter}
        />
      </ContentPageLayout>
    </HydrationBoundary>
  );
}
