"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  ApiErrorResponse,
  orderStatuses,
  OrderStatuses,
  Product,
  PurchaseOrder,
} from "@/lib/types";
import { ColumnDef, Row } from "@tanstack/react-table";
import Router from "next/router";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import {
  ActionSubmenuItem,
  DataTableRowActions,
} from "@/components/data-table/data-table-row-actions";
import { formatDate, timeAgo } from "@/lib/utils";
import { deleteProduct } from "@/api/product";
import {
  cancelPurchaseOrder,
  deletePurchaseOrder,
  sendPurchaseOrder,
  updatePurchaseOrder,
  updateStock,
} from "@/api/purchase-order";
import {
  Ban,
  CircleDashedIcon,
  CircleIcon,
  FileText,
  HandCoins,
  LucideFileSpreadsheet,
  PackageCheck,
  Send,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuShortcut,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { AlertModal } from "@/components/modal/alert-modal";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useModal } from "@/providers/modal-provider";
import Link from "next/link";
import TableCellLink from "@/components/ui/table-link";
import { CustomTableCell } from "@/components/data-table/data-table-utils";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { OrderStatusesWithIcons } from "@/constants/order-statuses";
export const columns: ColumnDef<PurchaseOrder>[] = [
  {
    accessorKey: "orderNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ORDER N°" />
    ),
    cell: ({ cell, row }) => {
      return (
        <CustomTableCell>
          {" "}
          <TableCellLink
            href={`/dashboard/purchase-orders/${row.original._id}`}
          >
            {cell.getValue() as string}
          </TableCellLink>
        </CustomTableCell>
      );
    },
  },
  {
    accessorKey: "orderType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ORDER TYPE" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("orderType") as string;
      return (
        <CustomTableCell>
          <Badge variant="default">{type}</Badge>
        </CustomTableCell>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="STATUS" />
    ),
    cell: ({ row }) => {
      const statusWithIcon = OrderStatusesWithIcons.find(
        (status) => status.name === row.original.status,
      );

      if (!statusWithIcon) {
        return null;
      }

      return (
        <CustomTableCell justify="start">
          <div className="ml-6 flex items-center">
            {
              <statusWithIcon.icon className="mb-[0.2rem] mr-2 h-4 w-4 text-muted-foreground" />
            }
            <span>{statusWithIcon.name}</span>
          </div>
        </CustomTableCell>
      );
    },
    filterFn: (row, id, value) => {
      return value instanceof Array && value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "supplier",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SUPPLIER" />
    ),
    cell: ({ row }) => {
      const orderType = row.original.orderType;
      const supplier = row.original.supplier;

      return (
        <CustomTableCell>
          {supplier && (
            <TableCellLink
              href={`/dashboard/${orderType.toLowerCase()}s/${supplier?._id}`}
            >
              {supplier?.name}
            </TableCellLink>
          )}
        </CustomTableCell>
      );
    },
  },
  {
    accessorKey: "client",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CLIENT" />
    ),
    cell: ({ row }) => {
      const orderType = row.original.orderType;
      const client = row.original.client;

      return (
        <CustomTableCell>
          {client && (
            <TableCellLink
              href={`/dashboard/${orderType.toLowerCase()}s/${client?._id}`}
            >
              {client?.name}
            </TableCellLink>
          )}
        </CustomTableCell>
      );
    },
  },

  {
    accessorKey: "orderDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ORDER DATE" />
    ),
    cell: ({ cell }) => {
      const formattedDate = formatDate(cell.getValue() as string);
      return <CustomTableCell>{formattedDate}</CustomTableCell>;
    },
  },

  {
    accessorKey: "orderTotal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="TOTAL" />
    ),
    cell: ({ row }) => {
      const total = row.getValue("orderTotal") as number;
      const formatted = new Intl.NumberFormat("tn-TN", {
        style: "currency",
        currency: "TND",
        maximumFractionDigits: 2,
      }).format(total);

      return <CustomTableCell>{formatted}</CustomTableCell>;
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
    cell: ({ row }) => {
      const [loading, setLoading] = useState(false);
      const { showModal } = useModal();
      const oldStatus = row.original.status;

      const handleCancel = () => {
        showModal(() => onConfirmCancel(row.original._id), {
          title: "Cancel Purchase Order",
          description: "Are you sure you want to cancel this purchase order?",
          confirmText: "Yes, Cancel",
          cancelText: "No, Keep",
        });
      };

      const onConfirmCancel = async (orderId: string) => {
        setLoading(true);
        try {
          const res = await cancelPurchaseOrder(orderId);
          toast({
            variant: "success",
            title: res.message,
            description: `Email sent to ${res.data.supplier?.email}`,
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: (error as ApiErrorResponse).message,
          });
        } finally {
          setLoading(false);
        }
      };
      const handleSend = async () => {
        setLoading(true);
        try {
          const res = await sendPurchaseOrder(row.original._id);
          toast({
            variant: "success",
            title: "Done!",
            description: res.message,
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: (error as ApiErrorResponse).message,
          });
        } finally {
          setLoading(false);
        }
      };

      const handleUpdateStock = async () => {
        setLoading(true);
        try {
          const res = await updateStock(row.original._id);
          toast({
            variant: "success",
            title: res.message,
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: (error as ApiErrorResponse).message,
          });
        } finally {
          setLoading(false);
        }
      };
      return (
        <>
          <DataTableRowActions
            loading={loading}
            setLoading={setLoading}
            deleteFunction={deletePurchaseOrder}
            editUrl={`/dashboard/purchase-orders/${row.original._id}`}
            row={row}
          >
            <DropdownMenuSeparator />
            {/* {renderPOStatusList(row, setLoading)} */}
            <DropdownMenuItem onClick={handleSend}>
              <Send className="mr-2 h-4 w-4" />
              Send email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              <Link
                className="flex w-full items-center"
                href={`/dashboard/purchase-orders/print/${row.original._id}`}
              >
                View PDF
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleUpdateStock}
              disabled={oldStatus === OrderStatuses.Delivered}
            >
              <PackageCheck className="mr-2 h-4 w-4" />
              Update stock
            </DropdownMenuItem>
            <DropdownMenuItem disabled={oldStatus !== OrderStatuses.Delivered}>
              <Link
                className="flex w-full items-center"
                href={`/dashboard/invoices/new?purchaseOrderId=${row.original._id}`}
              >
                <HandCoins className="mr-2 h-4 w-4" />
                Create invoice
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleCancel}
              disabled={oldStatus !== OrderStatuses.Pending}
            >
              <Ban className="mr-2 h-4 w-4" />
              Cancel
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DataTableRowActions>
        </>
      );
    },
  },
];
