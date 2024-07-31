import { getProducts, getTotalProducts } from "@/api/product";
import { columns } from "./columns";
import { Product } from "@/lib/types";
import { DataTable } from "@/components/data-table/data-table";
import { getCategories } from "@/api/category";
import { getSuppliers } from "@/api/supplier";

type PageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function DemoPage({ searchParams }: PageProps) {
  const { page, per_page, sort, ...filters } = searchParams;
  // Number of items per page
  const limit = typeof per_page === "string" ? parseInt(per_page) : 10;
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
          keyof Product | undefined,
          "asc" | "desc" | undefined,
        ])
      : [];

  console.log({ offset, limit, sortBy, order, ...filters });
  const data = await getProducts({ offset, limit, sortBy, order, ...filters });
  const total = await getTotalProducts();

  const pageCount = Math.ceil(total / limit);

  const categories = await getCategories();
  const suppliers = await getSuppliers();

  return (
    <div className="container mx-auto py-10">
      <DataTable
        searchableColumns={[{ id: "name", title: "Name" }]}
        filterableColumns={[
          {
            id: "category",
            title: "Category",
            options: categories.map((category) => ({
              label: category.name,
              value: category._id,
            })),
          },
          {
            id: "supplier",
            title: "Supplier",
            options: suppliers.map((supplier) => ({
              label: supplier.name,
              value: supplier._id,
            })),
          },
        ]}
        columns={columns}
        data={data}
        pageCount={pageCount}
      />
    </div>
  );
}
