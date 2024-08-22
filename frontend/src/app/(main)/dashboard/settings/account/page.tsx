import { getAuthUser } from "@/api/auth";
import { getTotalUsers, getUsers } from "@/api/user";
import { DataTable } from "@/components/data-table/data-table";
import { AccountForm } from "@/components/forms/account-form";
import ContentPageLayout from "@/components/layouts/content-page-layout";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ApiSearchFilter, QueryParams, User } from "@/lib/types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Account", link: "/dashboard/account" },
];

const Page = async () => {
  const res = await getAuthUser();
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <AccountForm
          title="Account"
          description="Update your account settings."
          action="Save changes"
          authUser={res.data}
        />
      </div>
    </ScrollArea>
  );
};

export default Page;
