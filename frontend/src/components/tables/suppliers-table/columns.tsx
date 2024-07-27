"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "../cell-action";
import { Supplier } from "@/lib/types";
import { deleteSupplier } from "@/api/supplier";
import { timeAgo } from "@/lib/utils";

export const columns: ColumnDef<Supplier>[] = [
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
    accessorKey: "email",
    header: "EMAIL",
  },

  {
    accessorKey: "phone",
    header: "PHONE",
  },
  {
    accessorKey: "address.street",
    header: "ADDRESS ",
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
        queryKey="suppliers"
        data={row.original}
        deleteFunction={deleteSupplier}
        editUrl={(id) => `/dashboard/suppliers/${id}/edit`}
      />
    ),
  },
];
