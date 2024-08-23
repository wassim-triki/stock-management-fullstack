import { DataTable } from "@/components/data-table/data-table";
import ContentPageLayout from "@/components/layouts/content-page-layout";
import { columns } from "./columns";
import { Client } from "@/lib/types";
import { getClients, getTotalClients } from "@/api/client";

type PageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Clients", link: "/dashboard/clients" },
];

export default async function ClientsPage({ searchParams }: PageProps) {
  const { page, per_page, sort, ...filters } = searchParams;
  const limit = typeof per_page === "string" ? parseInt(per_page) : 5;
  const offset =
    typeof page === "string"
      ? parseInt(page) > 0
        ? (parseInt(page) - 1) * limit
        : 0
      : 0;

  const [sortBy, order] =
    typeof sort === "string"
      ? (sort.split(".") as [
          keyof Client | undefined,
          "asc" | "desc" | undefined,
        ])
      : [];

  const data = await getClients({
    offset,
    limit,
    sortBy,
    order,
    ...filters,
  });
  const total = await getTotalClients();
  const pageCount = Math.ceil(total / limit);

  return (
    <ContentPageLayout
      breadcrumbItems={breadcrumbItems}
      addNewLink="/dashboard/clients/new"
      title={`Clients (${total})`}
      description="Manage clients"
    >
      <DataTable
        searchableColumns={[{ id: "name", title: "Client Name" }]}
        columns={columns}
        data={data}
        pageCount={pageCount}
      />
    </ContentPageLayout>
  );
}
