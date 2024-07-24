import { getTotalUsers, getUsers } from "@/api/user";
import ContentPageLayout from "@/components/layouts/content-page-layout";
import UsersTable from "@/components/tables/users-table/users-table";
import { queryKeys } from "@/lib/constants";
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

const Page = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.users],
    queryFn: getUsers,
  });

  const total = await queryClient.fetchQuery({
    queryKey: [queryKeys.totalUsers],
    queryFn: getTotalUsers,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <ContentPageLayout
      breadcrumbItems={breadcrumbItems}
      title={`Users (${total})`}
      description="Manage employees (Server side table functionalities.)"
      addNewLink="/dashboard/users/new"
    >
      <HydrationBoundary state={dehydratedState}>
        <UsersTable />
      </HydrationBoundary>
    </ContentPageLayout>
  );
};

export default Page;
