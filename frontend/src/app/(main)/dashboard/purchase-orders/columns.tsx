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
  addToStock,
  cancelPurchaseOrder,
  deletePurchaseOrder,
  sendPurchaseOrder,
  updatePurchaseOrder,
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
    accessorFn: (row) => row.supplier?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SUPPLIER" />
    ),
    cell: ({ cell, row }) => {
      return (
        <CustomTableCell>
          <TableCellLink
            href={`/dashboard/suppliers/${row.original.supplier?._id}`}
          >
            {cell.getValue() as string}
          </TableCellLink>
        </CustomTableCell>
      );
    },
    enableSorting: false,
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
            description: `Email sent to ${res.data.supplier.email}`,
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

      const handleAddToStock = async () => {
        setLoading(true);
        try {
          const res = await addToStock(row.original._id);
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
              onClick={handleAddToStock}
              disabled={oldStatus === OrderStatuses.Received}
            >
              <PackageCheck className="mr-2 h-4 w-4" />
              Add to stock
            </DropdownMenuItem>
            <DropdownMenuItem disabled={oldStatus !== OrderStatuses.Received}>
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

// const renderPOStatusList = (
//   row: Row<PurchaseOrder>,
//   setLoading: Dispatch<SetStateAction<boolean>>,
// ) => {
//   const { showModal } = useModal();
//   const handleStatusChange = async (status: string) => {
//     const oldStatus = row.original.status;
//     if (status === oldStatus) return;
//     setLoading(true);
//     try {
//       const res = await updatePurchaseOrder({
//         id: row.original._id,
//         data: { status },
//       });
//       toast({
//         variant: "success",
//         title: res.message,
//       });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: (error as ApiErrorResponse).message,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onConfirmCancel = async (orderId: string) => {
//     try {
//       const res = await cancelPurchaseOrder(orderId);
//       toast({
//         variant: "success",
//         title: res.message,
//         description: `Email sent to ${res.data.supplier.email}`,
//       });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: (error as ApiErrorResponse).message,
//       });
//     }
//   };

//   return (
//     <>
//       <DropdownMenuSub>
//         <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
//         <DropdownMenuSubContent>
//           <DropdownMenuRadioGroup value={row.original.status}>
//             <DropdownMenuRadioItem
//               onClick={() => handleStatusChange("Draft")}
//               value="Draft"
//             >
//               Draft
//             </DropdownMenuRadioItem>
//             <DropdownMenuRadioItem
//               onClick={() => handleStatusChange("Pending")}
//               value="Pending"
//             >
//               Pending
//             </DropdownMenuRadioItem>
//             <DropdownMenuRadioItem
//               onClick={() => handleStatusChange("Accepted")}
//               value="Accepted"
//             >
//               Accepted
//             </DropdownMenuRadioItem>
//             <DropdownMenuRadioItem
//               onClick={() => handleStatusChange("Received")}
//               value="Received"
//             >
//               Received
//             </DropdownMenuRadioItem>
//             <DropdownMenuRadioItem onClick={handleCancel} value="Canceled">
//               Canceled
//             </DropdownMenuRadioItem>
//           </DropdownMenuRadioGroup>
//         </DropdownMenuSubContent>
//       </DropdownMenuSub>
//     </>
//   );
// };
