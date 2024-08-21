"use client";

import Link from "next/link";
import { LayoutGrid, LogOut, User as UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAuthUser, logoutUser } from "@/api/auth";
import { capitalize, getInitials } from "@/lib/utils";
import { ApiSuccessResponse, User } from "@/lib/types";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { Badge } from "../ui/badge";

export default function UserNav() {
  const { data } = useQuery({
    queryKey: [queryKeys.auth],
    queryFn: getAuthUser,
  });

  const user = data?.data;

  const { mutate: logout, isPending: isSigningOut } = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      toast({
        variant: "success",
        title: data.message,
      });
      router.refresh();
    },
  });
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    logout();
  };

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="#" alt="Avatar" />
                  <AvatarFallback className="bg-transparent">
                    {/* {getInitials(
                      user?.profile.firstName + " " + user?.profile.lastName,
                    )} */}
                    <UserIcon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="flex items-center justify-between text-xs leading-none text-muted-foreground">
              <span className="truncate">{user?.email}</span>
              <Badge
                className="ml-2 flex-shrink-0"
                variant={user?.role === "Admin" ? "default" : "outline"}
              >
                {user?.role}
              </Badge>
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/dashboard" className="flex items-center">
              <LayoutGrid className="mr-3 h-4 w-4 text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/account" className="flex items-center">
              <UserIcon className="mr-3 h-4 w-4 text-muted-foreground" />
              Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4 text-muted-foreground" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
