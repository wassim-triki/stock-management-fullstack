//invoices/page.tsx
import { DataTable } from "@/components/data-table/data-table";
import ContentPageLayout from "@/components/layouts/content-page-layout";

import { columns } from "./columns";
import { PAYMENT_STATUSES } from "@/constants/payment-statuses";
import { Invoice } from "@/lib/types";
import { getInvoices, getTotalInvoices } from "@/api/invoice";

type PageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Invoices", link: "/dashboard/invoices" },
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
          keyof Invoice | undefined,
          "asc" | "desc" | undefined,
        ])
      : [];

  const data = await getInvoices({
    offset,
    limit,
    sortBy,
    order,
    ...filters,
  });
  const total = await getTotalInvoices();
  const pageCount = Math.ceil(total / limit);
  return (
    <ContentPageLayout
      breadcrumbItems={breadcrumbItems}
      addNewLink="/dashboard/invoices/new"
      title={`Invoices (${total})`}
      description="Manage invoices"
    >
      <DataTable
        searchableColumns={[{ id: "invoiceNumber", title: "Invoice number" }]}
        filterableColumns={[
          {
            id: "paymentStatus",
            title: "Payment status",
            options: Object.values(PAYMENT_STATUSES).map((status) => ({
              label: status,
              value: status,
              // icon: status.icon,
            })),
          },
        ]}
        columns={columns}
        data={data}
        pageCount={pageCount}
      />
    </ContentPageLayout>
  );
}
