"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Category, Product } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { timeAgo } from "@/lib/utils";
import { deleteProduct } from "@/api/product";
import { deleteCategory } from "@/api/category";
import {
  CustomTableCell,
  getUserColumn,
} from "@/components/data-table/data-table-utils";

export const columns: ColumnDef<Category>[] = [
  getUserColumn(),
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NAME" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label)

      return <CustomTableCell>{row.getValue("name")}</CustomTableCell>;
    },
  },

  {
    accessorKey: "parentCategory",
    accessorFn: (row) => row.parentCategory?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PARENT CATEGORY" />
    ),
    cell: ({ cell }) => {
      const formatted = cell.getValue() as string;
      return <CustomTableCell>{formatted}</CustomTableCell>;
    },
    enableSorting: false,
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
        deleteFunction={deleteCategory}
        editUrl={`/dashboard/categories/${row.original._id}`}
        row={row}
      />
    ),
  },
];
