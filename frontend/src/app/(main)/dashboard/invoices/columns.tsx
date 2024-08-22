"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Supplier, SupplierInvoice } from "@/lib/types";
import { deleteSupplier } from "@/api/supplier";
import { formatDate, timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import TableCellLink from "@/components/ui/table-link";
import { PAYMENT_STATUSES } from "@/constants/payment-statuses";
import { Badge } from "@/components/ui/badge";
import { deleteSupplierInvoice } from "@/api/supplier-invoices";
import { getUserColumn } from "../products/columns";

export const columns: ColumnDef<SupplierInvoice>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  getUserColumn(),
  {
    accessorKey: "invoiceNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="INVOICE N°" />
    ),
    cell: ({ cell, row }) => {
      return (
        <TableCellLink
          href={`/dashboard/suppliers/invoices/${row.original._id}`}
        >
          {cell.getValue() as string}
        </TableCellLink>
      );
    },
  },
  {
    accessorKey: "purchaseOrder.orderNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ORDER N°" />
    ),
    cell: ({ cell, row }) => {
      return (
        <TableCellLink href={`/dashboard/purchase-orders/${row.original._id}`}>
          {cell.getValue() as string}
        </TableCellLink>
      );
    },
  },

  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="TOTAL" />
    ),
    cell: ({ row }) => {
      const total = row.getValue("totalAmount") as number;
      const formatted = new Intl.NumberFormat("tn-TN", {
        style: "currency",
        currency: "TND",
        maximumFractionDigits: 2,
      }).format(total);

      return (
        <div className="flex items-center">
          <span>{formatted}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "paidAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PAID" />
    ),
    cell: ({ row }) => {
      const total = row.getValue("paidAmount") as number;
      const formatted = new Intl.NumberFormat("tn-TN", {
        style: "currency",
        currency: "TND",
        maximumFractionDigits: 2,
      }).format(total);

      return (
        <div className="flex items-center">
          <span>{formatted}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DUE" />
    ),
    cell: ({ row }) => {
      const total = row.getValue("totalAmount") as number;
      const paid = row.getValue("paidAmount") as number;
      const due = total - paid >= 0 ? total - paid : 0;
      const formatted = new Intl.NumberFormat("tn-TN", {
        style: "currency",
        currency: "TND",
        maximumFractionDigits: 2,
      }).format(due);

      return (
        <div className="flex items-center">
          <span>{formatted}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="STATUS" />
    ),
    cell: ({ row, cell }) => {
      const status = Object.values(PAYMENT_STATUSES).find(
        (status) => status === cell.getValue(),
      );

      if (!status) {
        return null;
      }

      let badgeVariant: "default" | "secondary" | "outline" | "destructive" =
        "default";
      switch (status) {
        case PAYMENT_STATUSES.PAID:
          badgeVariant = "secondary";
          break;
        case PAYMENT_STATUSES.UNPAID:
          badgeVariant = "default";
          break;
        case PAYMENT_STATUSES.PARTIALLY_PAID:
          badgeVariant = "outline";
          break;
        case PAYMENT_STATUSES.OVERDUE:
          badgeVariant = "destructive";
          break;
      }

      return (
        <div className="flex w-[100px] items-center">
          <Badge variant={badgeVariant}>{status}</Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "paymentDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PAYMENT DATE" />
    ),
    cell: ({ cell }) => {
      const formattedDate = cell.getValue()
        ? formatDate(cell.getValue() as string)
        : "N/A";
      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DUE DATE" />
    ),
    cell: ({ cell }) => {
      const formattedDate = formatDate(cell.getValue() as string);
      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="LAST UPDATED" />
    ),
    cell: ({ cell }) => {
      const formattedDate = timeAgo(cell.getValue() as string);
      return <span>{formattedDate}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        deleteFunction={deleteSupplierInvoice}
        editUrl={`/dashboard/suppliers/invoices/${row.original._id}`}
        row={row}
      />
    ),
  },
];
