"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  ApiErrorResponse,
  POStatus,
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
import { PO_STATUSES, POStatusListItem } from "@/lib/constants";
import {
  addToStock,
  cancelPurchaseOrder,
  deletePurchaseOrder,
  sendPurchaseOrder,
  updatePurchaseOrder,
} from "@/api/purchase-order";
import {
  Ban,
  FileText,
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
export const columns: ColumnDef<PurchaseOrder>[] = [
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
  //   accessorKey: "name",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Name" />
  //   ),
  //   cell: ({ row }) => {
  //     // const label = labels.find((label) => label.value === row.original.label)

  //     return (
  //       <div className="flex space-x-2">
  //         {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
  //         <span className="max-w-[500px] truncate font-medium">
  //           {row.getValue("name")}
  //         </span>
  //       </div>
  //     );
  //   },
  // },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="STATUS" />
    ),
    cell: ({ row }) => {
      const status = PO_STATUSES.find(
        (status) => status.name === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.name}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "orderNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ORDER N°" />
    ),
    cell: ({ cell, row }) => {
      return (
        <TableCellLink href={`/dashboard/purchase-orders/${row.original._id}`}>
          {cell.getValue() as string}
        </TableCellLink>
      );
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
        <TableCellLink
          href={`/dashboard/suppliers/${row.original.supplier._id}`}
        >
          {cell.getValue() as string}
        </TableCellLink>
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
      return <span>{formattedDate}</span>;
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
      }).format(total);

      return (
        <div className="flex items-center">
          <span>{formatted}</span>
        </div>
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
      return <span>{formattedDate}</span>;
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
              disabled={oldStatus === "Received"}
            >
              <PackageCheck className="mr-2 h-4 w-4" />
              Add to stock
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleCancel}
              disabled={oldStatus !== "Pending"}
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
