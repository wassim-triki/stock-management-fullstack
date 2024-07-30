import { getTotalUsers, getUsers } from "@/api/user";
import ContentPageLayout from "@/components/layouts/content-page-layout";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "@/components/tables/users-table/columns";
import { queryKeys } from "@/lib/constants";
import { ApiSearchFilter, QueryParams } from "@/lib/types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import { SortFieldSelect } from "../suppliers/page";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Users", link: "/dashboard/users" },
];

type ParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const Page = async ({ searchParams }: ParamsProps) => {
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
    queryKey: [queryKeys.users, queryParams],
    queryFn: () => getUsers(queryParams),
  });

  const total = await queryClient.fetchQuery({
    queryKey: [queryKeys.totalUsers],
    queryFn: getTotalUsers,
  });
  const pageCount = Math.ceil(total / limit);

  const dehydratedState = dehydrate(queryClient);
  const sortFields: SortFieldSelect[] = [
    { value: "updatedAt_desc", label: "Last updated", type: "desc" },
    { value: "updatedAt_asc", label: "Last updated", type: "asc" },
    { value: "name_desc", label: "Name", type: "desc" },
    { value: "name_asc", label: "Name", type: "asc" },
  ];
  const defaultSearchField = { value: "email", label: "Email" };

  return (
    <ContentPageLayout
      breadcrumbItems={breadcrumbItems}
      title={`Users (${total})`}
      description="Manage employees (Server side table functionalities.)"
      addNewLink="/dashboard/users/new"
    >
      <HydrationBoundary state={dehydratedState}>
        <DataTable
          rQPrams={{
            queryKey: queryKeys.users,
            queryFn: getUsers,
          }}
          defaultSearchField={defaultSearchField}
          columns={columns}
          pageCount={pageCount}
          queryParams={queryParams}
          sortFields={sortFields}
        />
      </HydrationBoundary>
    </ContentPageLayout>
  );
};

export default Page;
