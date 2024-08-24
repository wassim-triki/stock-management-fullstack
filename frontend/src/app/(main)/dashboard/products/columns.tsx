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
import {
  CustomTableCell,
  getUserColumn,
} from "@/components/data-table/data-table-utils";

export const columns: ColumnDef<Product>[] = [
  getUserColumn(),
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label)

      return <CustomTableCell>{row.getValue("name")}</CustomTableCell>;
    },
    filterFn: (row, id, value) => {
      return value instanceof Array && value.includes(row.getValue(id));
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
        <CustomTableCell>
          <span>{formatted}</span>
        </CustomTableCell>
      );
    },
  },
  {
    accessorKey: "supplier",
    accessorFn: (row) => row.supplier.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SUPPLIER" />
    ),
    cell: ({ row, column }) => {
      const supplier = row.original.supplier;
      //retruns undefined
      console.log(column.getFilterValue());

      return (
        <CustomTableCell>
          <TableCellLink href={`/dashboard/suppliers/${supplier?._id}`}>
            {supplier?.name}
          </TableCellLink>
        </CustomTableCell>
      );
    },
    enableSorting: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "category",
    accessorFn: (row) => row.category?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CATEGORY" />
    ),
    cell: ({ cell, row }) => {
      return (
        <CustomTableCell>
          <span>{row.getValue("category")}</span>
        </CustomTableCell>
      );
    },
    enableSorting: false,
    enableColumnFilter: true, // Ensure filtering is enabled for the column
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
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
    cell: ({ cell, row }) => {
      return (
        <CustomTableCell>
          <span>{row.getValue("quantityInStock")}</span>
        </CustomTableCell>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="LAST UPDATED" />
    ),
    cell: ({ cell }) => {
      const formattedDate = timeAgo(cell.getValue() as string);

      return (
        <CustomTableCell>
          {" "}
          <span>{formattedDate}</span>
        </CustomTableCell>
      );
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
