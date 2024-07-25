"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Product, Supplier } from "@/lib/types";
import { CellAction } from "../cell-action";

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: "price",
    header: "PRICE",
  },

  {
    accessorKey: "category.name",
    header: "CATEGORY",
  },
  {
    accessorKey: "supplier.name",
    header: "SUPPLIER",
  },
  {
    accessorKey: "quantityInStock",
    header: "QUANTITY",
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
  // {
  //   id: "actions",
  //   cell: ({ row }) => (
  //     <CellAction
  //       queryKey="users"
  //       data={row.original}
  //       deleteFunction={deleteProduct}
  //       editUrl={(id) => `/dashboard/suppliers/${id}/edit`}
  //     />
  //   ),
  // },
];
