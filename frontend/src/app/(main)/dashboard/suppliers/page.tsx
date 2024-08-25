import { getProducts, getTotalProducts } from "@/api/product";
import { Product, Supplier } from "@/lib/types";
import { DataTable } from "@/components/data-table/data-table";
import { getCategories } from "@/api/category";
import { getSuppliers, getTotalSuppliers } from "@/api/supplier";
import ContentPageLayout from "@/components/layouts/content-page-layout";
import { columns } from "./columns";

type PageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Products", link: "/dashboard/products" },
];

export default async function DemoPage({ searchParams }: PageProps) {
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
          keyof Supplier | undefined,
          "asc" | "desc" | undefined,
        ])
      : [];

  console.log({ offset, limit, sortBy, order, ...filters });
  const data = await getSuppliers({ offset, limit, sortBy, order, ...filters });
  const total = await getTotalSuppliers();

  const pageCount = Math.ceil(total / limit);

  return (
    <ContentPageLayout
      breadcrumbItems={breadcrumbItems}
      addNewLink="/dashboard/suppliers/new"
      title={`Suppliers (${total})`}
      description="Manage suppliers"
    >
      <DataTable
        searchableColumns={[{ id: "name", title: "Name" }]}
        filterableColumns={[
          {
            id: "active",
            title: "Status",
            options: [
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ],
          },
        ]}
        columns={columns}
        data={data}
        pageCount={pageCount}
      />
    </ContentPageLayout>
  );
}
