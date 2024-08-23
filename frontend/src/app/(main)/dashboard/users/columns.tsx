"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Supplier, User } from "@/lib/types";
import { deleteSupplier } from "@/api/supplier";
import { timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { deleteUser } from "@/api/user";
import { Badge } from "@/components/ui/badge";
import ActiveBadge from "@/components/ui/active-bage";
import TableCellLink from "@/components/ui/table-link";
import { CustomTableCell } from "@/components/data-table/data-table-utils";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="EMAIL" />
    ),
    cell: ({ row }) => {
      return (
        <CustomTableCell>
          <TableCellLink
            href={`/dashboard/users/${row.original._id}`}
            className="flex space-x-2"
          >
            {row.getValue("email")}
          </TableCellLink>
        </CustomTableCell>
      );
    },
  },
  {
    accessorKey: "profile",
    accessorFn: (row) => {
      let name = "";
      if (row.profile?.firstName) {
        name += row.profile?.firstName;
      }
      if (row.profile?.lastName) {
        name += " " + row.profile?.lastName;
      }
      return name.trim();
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="FULL NAME" />
    ),
    cell: ({ row }) => {
      return <CustomTableCell>{row.getValue("profile")}</CustomTableCell>;
    },
  },

  {
    accessorKey: "address",
    accessorFn: (row) => row.profile?.address,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ADDRESS" />
    ),
    enableSorting: false,
    cell: ({ row }) => {
      return <CustomTableCell>{row.getValue("address")}</CustomTableCell>;
    },
  },

  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ROLE" />
    ),
    cell: ({ row }) => {
      return <CustomTableCell>{row.getValue("role")}</CustomTableCell>;
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
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="STATUS" />
    ),
    enableSorting: false,
    cell: ({ row }) => (
      <CustomTableCell>
        <ActiveBadge active={row.getValue("active")} />
      </CustomTableCell>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        deleteFunction={deleteUser}
        editUrl={`/dashboard/users/${row.original._id}`}
        row={row}
      />
    ),
  },
];
