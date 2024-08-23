"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Supplier } from "@/lib/types";
import { deleteSupplier } from "@/api/supplier";
import { timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import ActiveBadge from "@/components/ui/active-bage";
import {
  CustomTableCell,
  getUserColumn,
} from "@/components/data-table/data-table-utils";

export const columns: ColumnDef<Supplier>[] = [
  getUserColumn(),
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NAME" />
    ),
    cell: ({ row }) => {
      return <CustomTableCell>{row.getValue("name")}</CustomTableCell>;
    },
  },

  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="EMAIL" />
    ),
    cell: ({ row }) => {
      return <CustomTableCell>{row.getValue("email")}</CustomTableCell>;
    },
  },

  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PHONE" />
    ),
    cell: ({ row }) => {
      return <CustomTableCell>{row.getValue("phone")}</CustomTableCell>;
    },
  },
  {
    accessorKey: "address",
    accessorFn: (row) => row.address,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ADDRESS" />
    ),
    cell: ({ row }) => {
      return <CustomTableCell>{row.getValue("address")}</CustomTableCell>;
    },
  },
  {
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="STATUS" />
    ),
    cell: ({ row }) => (
      <CustomTableCell>
        <ActiveBadge active={row.getValue("active")} />
      </CustomTableCell>
    ),
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
        deleteFunction={deleteSupplier}
        editUrl={`/dashboard/suppliers/${row.original._id}`}
        row={row}
      />
    ),
  },
];
