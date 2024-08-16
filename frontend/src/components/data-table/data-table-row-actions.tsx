"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ApiSuccessResponse } from "@/lib/types";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { AlertModal } from "../modal/alert-modal";
import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { PO_STATUSES } from "@/lib/constants";

export type ActionSubmenuItem = {
  label: string;
  value: string;
  onClick?: () => void;
};
export type ActionSubmenu = {
  title: string;
  items: ActionSubmenuItem[];
  defaultItem: ActionSubmenuItem;
};
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  editUrl: string;
  deleteFunction: (id: string) => Promise<ApiSuccessResponse<TData>>;
  submenues?: ActionSubmenu[];
}

export function DataTableRowActions<TData extends { _id: string }>({
  row,
  editUrl = "",
  deleteFunction,
  submenues,
}: DataTableRowActionsProps<TData>) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const onConfirm = async () => {
    setLoading(true);
    const res = await deleteFunction(row.original._id);
    toast({
      variant: "success",
      title: res.message,
    });
    setLoading(false);
    setOpen(false);
    router.refresh();
  };

  const labels = [
    { value: "pending", label: "Pending" },
    { value: "received", label: "Received" },
  ];

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {submenues?.map((submenu) => (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>{submenu.title}</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={submenu.defaultItem.value}>
                    {submenu.items.map((item) => (
                      <DropdownMenuRadioItem
                        key={item.value}
                        value={item.value}
                        onClick={() => {
                          item.onClick?.();
                        }}
                      >
                        {item.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
            </>
          ))}
          <DropdownMenuItem>
            <Link className="flex w-full items-center" href={editUrl}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
