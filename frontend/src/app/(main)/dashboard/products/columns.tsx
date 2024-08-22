"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Product, ROLES, User } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { timeAgo } from "@/lib/utils";
import { deleteProduct } from "@/api/product";
import TableCellLink from "@/components/ui/table-link";
import { getAuthUser } from "@/api/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

export function getUserColumn<T>(): ColumnDef<T> {
  return {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="USER" />
    ),
    cell: async ({ row, cell, column, table }) => {
      const auth = useAuth();
      const user = (row.original as { user: User }).user;
      if (auth.role !== ROLES.ADMIN) {
        column.toggleVisibility(false);
      }

      return (
        <TableCellLink href={`/dashboard/users/${user._id}`}>
          {user.email}
        </TableCellLink>
      );
    },
  };
}

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  getUserColumn(),
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PRICE" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("tn-TN", {
        style: "currency",
        currency: "TND",
        maximumFractionDigits: 2,
      }).format(amount);

      return (
        <div className="flex items-center">
          <span>{formatted}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "supplier",
    accessorFn: (row) => row.supplier.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SUPPLIER" />
    ),
    cell: async ({ row }) => {
      const supplier = row.original.supplier;

      return (
        <TableCellLink href={`/dashboard/suppliers/${supplier._id}`}>
          {supplier.name}
        </TableCellLink>
      );
    },
    enableSorting: false,
  },

  {
    accessorKey: "category",
    accessorFn: (row) => row.category.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CATEGORY" />
    ),
    enableSorting: false,
  },

  // {
  //   accessorKey: "category.name",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="CATEGORY" />
  //   ),
  //   enableSorting: false,
  // },
  {
    accessorKey: "quantityInStock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="QUANTITY" />
    ),

    // filterFn: (row, id, value) => {
    //   return value.includes(row.getValue(id))
    // },
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
        deleteFunction={deleteProduct}
        editUrl={`/dashboard/products/${row.original._id}`}
        row={row}
      />
    ),
  },
];
