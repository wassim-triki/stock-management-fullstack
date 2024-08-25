"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { useAuth } from "@/providers/auth-provider";
import { ROLES, User } from "@/lib/types";
import TableCellLink from "../ui/table-link";

export const CustomTableCell = ({
  children,
  justify = "center",
}: {
  children: React.ReactNode;
  justify?: "start" | "center" | "end";
}) => {
  return (
    <div className={`flex w-full justify-${justify} space-x-2 pr-3`}>
      <span className="max-w-[120px] truncate font-medium">
        {children || "N/A"}
      </span>
    </div>
  );
};

export function getUserColumn<T>(): ColumnDef<T> {
  return {
    accessorKey: "user",
    header: ({ column }) => {
      const auth = useAuth();
      if (auth.role !== ROLES.ADMIN) {
        column.toggleVisibility(false);
      }
      return <DataTableColumnHeader column={column} title="USER" />;
    },
    cell: ({ row, cell, column, table }) => {
      const user = (row.original as { user: User }).user;
      return (
        <CustomTableCell>
          <TableCellLink href={`/dashboard/users/${user?._id}`}>
            {user?.email}
          </TableCellLink>
        </CustomTableCell>
      );
    },
  };
}
