"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useAxios } from "@/lib/axios/axios-client";
import { ApiErrorResponse, ApiSuccessResponse, Supplier } from "@/lib/types";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface CellActionProps {
  data: Supplier;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [{ data: res, loading, error }, executeDelete] = useAxios<
    ApiSuccessResponse<Supplier>,
    any,
    ApiErrorResponse
  >(
    {
      method: "DELETE",
    },
    { manual: true },
  );
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {
    executeDelete({
      url: `/api/suppliers/${data._id}`,
    })
      .then(({ data }) => {
        toast({
          variant: "success",
          title: data.message,
          // TODO; add undo
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: error.message,
        });
      })
      .finally(() => {
        setOpen(false);
        // TODO: add better way to refresh the table
        window.location.reload();
      });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem>
            <Link
              className="flex w-full items-center"
              href={`/dashboard/suppliers/${data._id}/edit`}
            >
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
};
