import {
  ApiSearchFilter,
  OrderStatuses,
  orderStatuses,
  OrderType,
  PurchaseOrder,
  QueryParams,
  ROLES,
  Supplier,
} from "@/lib/types";
import ContentPageLayout from "@/components/layouts/content-page-layout";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getTotalProducts } from "@/api/product";
import {
  getPurchaseOrders,
  getTotalPurchaseOrders,
} from "@/api/purchase-order";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Purchase Order", link: "/dashboard/purchase-orders" },
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
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
          keyof PurchaseOrder | undefined,
          "asc" | "desc" | undefined,
        ])
      : [];

  const purchaseOrders = await getPurchaseOrders({
    offset,
    limit,
    sortBy,
    order,
    ...filters,
  });
  const total = await getTotalPurchaseOrders();
  const pageCount = Math.ceil(total / limit);

  return (
    <ContentPageLayout
      breadcrumbItems={breadcrumbItems}
      addNewLink="/dashboard/purchase-orders/new"
      title={`Purchase Orders (${total})`}
      description="Manage purchase orders"
    >
      <DataTable
        searchableColumns={[{ id: "orderNumber", title: "Order number" }]}
        filterableColumns={[
          {
            id: "orderType",
            title: "Type",
            options: Object.values(OrderType).map((type) => ({
              label: type,
              value: type,
            })),
          },
          {
            id: "status",
            title: "Status",
            options: Object.values(OrderStatuses).map((status) => ({
              label: status,
              value: status,
            })),
          },
        ]}
        columns={columns}
        pageCount={pageCount}
        data={purchaseOrders}
      />
    </ContentPageLayout>
  );
}
