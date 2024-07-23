import { getUsers } from "@/api/user";
import ContentPageLayout from "@/components/layouts/content-page-layout";
import { DataTable } from "@/components/tables/data-table";
import SuppliersTable from "@/components/tables/suppliers-table/supplier-table";
import UsersTable from "@/components/tables/users-table/users-table";
import { queryKeys } from "@/lib/constants";
import getQueryClient from "@/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Users", link: "/dashboard/users" },
];

const Page = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.user],
    queryFn: getUsers,
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <ContentPageLayout
      breadcrumbItems={breadcrumbItems}
      title={`Users (${0})`}
      description="Manage employees (Server side table functionalities.)"
      addNewLink="/dashboard/suppliers/new"
    >
      <HydrationBoundary state={dehydratedState}>
        <UsersTable />
      </HydrationBoundary>
    </ContentPageLayout>
  );
};

export default Page;
