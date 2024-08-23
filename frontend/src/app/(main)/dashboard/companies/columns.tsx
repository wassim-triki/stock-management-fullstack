"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Category, Company, Product } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { timeAgo } from "@/lib/utils";
import { deleteProduct } from "@/api/product";
import { deleteCategory } from "@/api/category";

import { deleteCompany } from "@/api/company";
import {
  CustomTableCell,
  getUserColumn,
} from "@/components/data-table/data-table-utils";

export const columns: ColumnDef<Company>[] = [
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
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ADDRESS" />
    ),
    cell: ({ row }) => {
      return <CustomTableCell>{row.getValue("address")}</CustomTableCell>;
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
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="EMAIL" />
    ),
    cell: ({ row }) => {
      return <CustomTableCell>{row.getValue("email")}</CustomTableCell>;
    },
  },
  {
    accessorKey: "website",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="WEBSITE" />
    ),
    cell: ({ row }) => {
      return <CustomTableCell>{row.getValue("website")}</CustomTableCell>;
    },
  },
  {
    accessorKey: "logo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="LOGO" />
    ),
    cell: ({ row }) => {
      return <CustomTableCell>{row.getValue("logo")}</CustomTableCell>;
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
        deleteFunction={deleteCompany}
        editUrl={`/dashboard/companies/${row.original._id}`}
        row={row}
      />
    ),
  },
];
