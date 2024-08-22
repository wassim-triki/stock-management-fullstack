import { getTotalUsers, getUsers } from "@/api/user";
import { DataTable } from "@/components/data-table/data-table";
import ContentPageLayout from "@/components/layouts/content-page-layout";
import { ApiSearchFilter, QueryParams, User } from "@/lib/types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import { columns } from "./columns";

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
  const { page, per_page, sort, ...filters } = searchParams;
  // Number of items per page
  const limit = typeof per_page === "string" ? parseInt(per_page) : 5;
  // Number of items to skip
  const offset =
    typeof page === "string"
      ? parseInt(page) > 0
        ? (parseInt(page) - 1) * limit
        : 0
      : 0;

  // Column and order to sort by
  // Spliting the sort string by "." to get the column and order
  // Example: "title.desc" => ["title", "desc"]
  const [sortBy, order] =
    typeof sort === "string"
      ? (sort.split(".") as [
          keyof User | undefined,
          "asc" | "desc" | undefined,
        ])
      : [];

  const users = await getUsers({
    offset,
    limit,
    sortBy,
    order,
    ...filters,
  });
  const total = await getTotalUsers();
  const pageCount = Math.ceil(total / limit);

  return (
    <ContentPageLayout
      breadcrumbItems={breadcrumbItems}
      title={`Users (${total})`}
      description="Manage employees (Server side table functionalities.)"
      addNewLink="/dashboard/users/new"
    >
      <DataTable
        searchableColumns={[{ id: "email", title: "Email" }]}
        columns={columns}
        pageCount={pageCount}
        data={users}
      />
    </ContentPageLayout>
  );
};

export default Page;
