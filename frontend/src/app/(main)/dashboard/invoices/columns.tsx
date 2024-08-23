"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Invoice } from "@/lib/types";
import { deleteInvoice } from "@/api/invoice";
import { formatDate, timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import TableCellLink from "@/components/ui/table-link";
import { PAYMENT_STATUSES } from "@/constants/payment-statuses";
import { Badge } from "@/components/ui/badge";
import { getUserColumn } from "../products/columns";

export const columns: ColumnDef<Invoice>[] = [
  getUserColumn(),
  {
    accessorKey: "invoiceNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="INVOICE N°" />
    ),
    cell: ({ cell, row }) => {
      return (
        <TableCellLink href={`/dashboard/invoices/${row.original._id}`}>
          {cell.getValue() as string}
        </TableCellLink>
      );
    },
  },
  {
    accessorKey: "invoiceType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="INVOICE TYPE" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("invoiceType") as string;
      return <Badge variant="default">{type}</Badge>;
    },
  },
  {
    accessorKey: "entityId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SUPPLIER/CLIENT" />
    ),
    cell: ({ row }) => {
      const invoiceType = row.original.invoiceType;
      const entity =
        invoiceType === "Supplier"
          ? row.original.supplier
          : row.original.client;

      if (!entity) {
        return <span>N/A</span>;
      }

      return (
        <TableCellLink
          href={`/dashboard/${invoiceType.toLowerCase()}s/${entity._id}`}
        >
          {entity.name}
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
        deleteFunction={deleteInvoice}
        editUrl={`/dashboard/invoices/${row.original._id}`}
        row={row}
      />
    ),
  },
];
