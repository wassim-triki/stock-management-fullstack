// invoices/columns.tsx
"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Invoice } from "@/lib/types";
import { deleteInvoice } from "@/api/invoice";
import { formatCurrency, formatDate, timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import TableCellLink from "@/components/ui/table-link";
import { Badge } from "@/components/ui/badge";
import {
  CustomTableCell,
  getUserColumn,
} from "@/components/data-table/data-table-utils";
import { PaymentStatuses } from "@/constants/payment-statuses";
import { useAuth } from "@/providers/auth-provider";

export const columns: ColumnDef<Invoice>[] = [
  getUserColumn(),
  {
    accessorKey: "invoiceNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="INVOICE N°" />
    ),
    cell: ({ cell, row }) => {
      return (
        <CustomTableCell>
          <TableCellLink href={`/dashboard/invoices/${row.original._id}`}>
            {cell.getValue() as string}
          </TableCellLink>
        </CustomTableCell>
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
      return (
        <CustomTableCell>
          <Badge variant="default">{type}</Badge>
        </CustomTableCell>
      );
    },
  },
  {
    accessorKey: "supplier",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SUPPLIER" />
    ),
    cell: ({ row }) => {
      const invoiceType = row.original.invoiceType;
      const supplier = row.original.supplier;

      return (
        <CustomTableCell>
          {supplier && (
            <TableCellLink
              href={`/dashboard/${invoiceType.toLowerCase()}s/${supplier?._id}`}
            >
              {supplier?.name}
            </TableCellLink>
          )}
        </CustomTableCell>
      );
    },
  },
  {
    accessorKey: "client",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CLIENT" />
    ),
    cell: ({ row }) => {
      const invoiceType = row.original.invoiceType;
      const client = row.original.client;

      return (
        <CustomTableCell>
          {client && (
            <TableCellLink
              href={`/dashboard/${invoiceType.toLowerCase()}s/${client?._id}`}
            >
              {client?.name}
            </TableCellLink>
          )}
        </CustomTableCell>
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
        <CustomTableCell>
          {row.original.purchaseOrder?._id && (
            <TableCellLink
              href={`/dashboard/purchase-orders/${row.original._id}`}
            >
              {cell.getValue() as string}
            </TableCellLink>
          )}
        </CustomTableCell>
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
      const auth = useAuth();
      if (!auth.currency) return;
      return (
        <CustomTableCell>
          <span>{formatCurrency(total, auth.currency)}</span>
        </CustomTableCell>
      );
    },
  },
  {
    accessorKey: "paidAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PAID" />
    ),
    cell: ({ row }) => {
      const total = row.getValue("totalAmount") as number;
      const auth = useAuth();
      if (!auth.currency) return;
      return (
        <CustomTableCell>
          <span>{formatCurrency(total, auth.currency)}</span>
        </CustomTableCell>
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
      const auth = useAuth();
      if (!auth.currency) return;
      return (
        <CustomTableCell>
          <span>{formatCurrency(due, auth.currency)}</span>
        </CustomTableCell>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="STATUS" />
    ),
    cell: ({ row, cell }) => {
      const status = Object.values(PaymentStatuses).find(
        (status) => status === cell.getValue(),
      );

      if (!status) {
        return null;
      }

      let badgeVariant: "default" | "secondary" | "outline" | "destructive" =
        "default";
      switch (status) {
        case PaymentStatuses.Paid:
          badgeVariant = "secondary";
          break;
        case PaymentStatuses.Unpaid:
          badgeVariant = "default";
          break;
        case PaymentStatuses.PartiallyPaid:
          badgeVariant = "outline";
          break;
        case PaymentStatuses.Overdue:
          badgeVariant = "destructive";
          break;
      }

      return (
        <CustomTableCell>
          <Badge variant={badgeVariant}>{status}</Badge>
        </CustomTableCell>
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
      const formattedDate = formatDate(cell.getValue() as string);
      return <CustomTableCell>{formattedDate}</CustomTableCell>;
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DUE DATE" />
    ),
    cell: ({ cell }) => {
      const formattedDate = formatDate(cell.getValue() as string);
      return <CustomTableCell>{formattedDate}</CustomTableCell>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="LAST UPDATED" />
    ),
    cell: ({ cell }) => {
      const formattedDate = timeAgo(cell.getValue() as string);
      return <CustomTableCell>{formattedDate}</CustomTableCell>;
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
