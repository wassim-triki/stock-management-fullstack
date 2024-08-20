import ContentPageLayout from "@/components/layouts/content-page-layout";

import { queryKeys } from "@/lib/constants";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCategories, getTotalCategories } from "@/api/category";
import { ApiSearchFilter, Category, QueryParams } from "@/lib/types";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table/data-table";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Categories", link: "/dashboard/categories" },
];

type ParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: ParamsProps) {
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
          keyof Category | undefined,
          "asc" | "desc" | undefined,
        ])
      : [];

  const data = await getCategories({
    offset,
    limit,
    sortBy,
    order,
    ...filters,
  });
  const total = await getTotalCategories();
  const pageCount = Math.ceil(total / limit);
  return (
    <ContentPageLayout
      breadcrumbItems={breadcrumbItems}
      addNewLink="/dashboard/categories/new"
      title={`Categories (${total})`}
      description="Manage categories"
    >
      <DataTable
        searchableColumns={[{ id: "name", title: "Name" }]}
        columns={columns}
        data={data}
        pageCount={pageCount}
      />
    </ContentPageLayout>
  );
}
