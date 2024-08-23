"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Client } from "@/lib/types";
import { deleteClient } from "@/api/client";
import { formatDate, timeAgo } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import TableCellLink from "@/components/ui/table-link";
import ActiveBadge from "@/components/ui/active-bage";
import {
  CustomTableCell,
  getUserColumn,
} from "@/components/data-table/data-table-utils";

export const columns: ColumnDef<Client>[] = [
  getUserColumn(),
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client Name" />
    ),
    cell: ({ cell, row }) => {
      return (
        <CustomTableCell>
          <TableCellLink href={`/dashboard/clients/${row.original._id}`}>
            {cell.getValue() as string}
          </TableCellLink>
        </CustomTableCell>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <CustomTableCell>{row.getValue("email") as string}</CustomTableCell>
      );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      return (
        <CustomTableCell>{row.getValue("phone") as string}</CustomTableCell>
      );
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      return (
        <CustomTableCell>{row.getValue("address") as string}</CustomTableCell>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ cell }) => {
      const formattedDate = formatDate(cell.getValue() as string);
      return <CustomTableCell>{formattedDate}</CustomTableCell>;
    },
  },
  {
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="STATUS" />
    ),
    cell: ({ row }) => <ActiveBadge active={row.getValue("active")} />,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Updated" />
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
        deleteFunction={deleteClient}
        editUrl={`/dashboard/clients/${row.original._id}`}
        row={row}
      />
    ),
  },
];
