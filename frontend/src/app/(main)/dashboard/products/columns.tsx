"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { timeAgo } from "@/lib/utils";
import { deleteProduct } from "@/api/product";

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
  // {
  //   accessorKey: "_id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="REF" />
  //   ),
  //   cell: ({ row }) => <div className="w-[80px]">{row.getValue("_id")}</div>,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
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
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
  //   cell: ({ row }) => {
  //     const status = statuses.find(
  //       (status) => status.value === row.getValue("status")
  //     )

  //     if (!status) {
  //       return null
  //     }

  //     return (
  //       <div className="flex w-[100px] items-center">
  //         {status.icon && (
  //           <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{status.label}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  {
    accessorKey: "supplier",
    accessorFn: (row) => row.supplier.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SUPPLIER" />
    ),
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
