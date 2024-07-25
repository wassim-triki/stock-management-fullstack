import { getTotalUsers, getUsers } from "@/api/user";
import ContentPageLayout from "@/components/layouts/content-page-layout";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "@/components/tables/users-table/columns";
import { queryKeys } from "@/lib/constants";
import { ApiSearchFilter } from "@/lib/types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

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
  const search = searchParams.search?.toString() || "";
  const filter: ApiSearchFilter = {
    limit,
    page,
    search,
  };
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.users, filter],
    queryFn: () => getUsers(filter),
  });

  const total = await queryClient.fetchQuery({
    queryKey: [queryKeys.totalUsers],
    queryFn: getTotalUsers,
  });
  const pageCount = Math.ceil(total / limit);

  const dehydratedState = dehydrate(queryClient);

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
          searchKey="email"
          columns={columns}
          pageCount={pageCount}
          filter={filter}
        />
      </HydrationBoundary>
    </ContentPageLayout>
  );
};

export default Page;
