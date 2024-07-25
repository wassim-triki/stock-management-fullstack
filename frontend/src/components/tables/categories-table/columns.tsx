"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "../cell-action";
import { Category, Supplier } from "@/lib/types";
import { deleteSupplier } from "@/api/supplier";
import { queryKeys } from "@/lib/constants";

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: "name",
    header: "NAME",
  },

  {
    accessorKey: "parentCategory.name",
    header: "PARENT CATEGORY",
  },
  {
    accessorKey: "updatedAt",
    header: "LAST UPDATED",
    cell: ({ cell }) => {
      const date = new Date(cell.getValue() as string);
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
      return <span>{formattedDate}</span>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => (
      <CellAction
        queryKey={queryKeys.categories}
        data={row.original}
        deleteFunction={deleteSupplier}
        editUrl={(id) => `/dashboard/categories/${id}/edit`}
      />
    ),
  },
];
