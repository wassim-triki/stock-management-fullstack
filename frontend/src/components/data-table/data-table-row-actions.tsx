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
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/types";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { AlertModal } from "../modal/alert-modal";
import { Edit, LucideIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModal } from "@/providers/modal-provider";
import Spinner from "../spinner";

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
  children?: React.ReactNode;
  loading?: boolean;
  setLoading?: (value: boolean) => void;
}

export function DataTableRowActions<TData extends { _id: string }>({
  row,
  editUrl = "",
  deleteFunction,
  submenues,
  children,
  loading = false,
  setLoading,
}: DataTableRowActionsProps<TData>) {
  const { toast } = useToast();
  const { showModal } = useModal();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const handleDelete = async () => {
    showModal(async () => {
      try {
        setLoading && setLoading(true);
        setDeleteLoading(true);
        const res = await deleteFunction(row.original._id);
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
        setDeleteLoading(false);
        setLoading && setLoading(false);
      }
    });
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {loading || deleteLoading ? (
            <Spinner />
          ) : (
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <DotsHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {children}
          <DropdownMenuItem>
            <Link className="flex w-full items-center" href={editUrl}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
