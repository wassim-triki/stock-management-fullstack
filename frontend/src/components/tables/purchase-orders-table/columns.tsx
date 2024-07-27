"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { POStatus, Product, PurchaseOrder, Supplier } from "@/lib/types";
import { CellAction } from "../cell-action";
import { queryKeys } from "@/lib/constants";
import { deleteProduct } from "@/api/product";
import { deletePurchaseOrder } from "@/api/purchase-order";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";

export const columns: ColumnDef<PurchaseOrder>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ cell }) => {
      const value: POStatus = cell.getValue() as POStatus;
      const variant =
        value === "Pending"
          ? "default"
          : value === "Accepted"
            ? "success"
            : "secondary";
      return (
        <span>
          <Badge variant={variant}>{value}</Badge>
        </span>
      );
    },
  },

  {
    accessorKey: "orderNumber",
    header: "ORDER NUMBER",
  },

  {
    accessorKey: "supplier.name",
    header: "SUPPLIER",
  },

  {
    accessorKey: "updatedAt",
    header: "LAST UPDATED",
    cell: ({ cell }) => {
      const formattedDate = timeAgo(cell.getValue() as string);
      return <span>{formattedDate}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <CellAction
        queryKey={queryKeys.purchaseOrders}
        data={row.original}
        deleteFunction={deletePurchaseOrder}
        editUrl={(id) => `/dashboard/stock/products/${id}/edit`}
      />
    ),
  },
];
