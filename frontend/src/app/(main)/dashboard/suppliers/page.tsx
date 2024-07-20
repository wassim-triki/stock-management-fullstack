import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { columns } from "@/components/tables/employee-tables/columns";

import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Supplier } from "@/lib/types";
import { DataTable } from "@/components/tables/data-table";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Suppliers", link: "/dashboard/suppliers" },
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const country = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  const res = await fetch(
    `https://api.slingacademy.com/v1/sample-data/users?offset=${offset}&limit=${pageLimit}` +
      (country ? `&search=${country}` : ""),
  );
  const dataRes = await res.json();
  const totalUsers = dataRes.total_users; //1000
  const pageCount = Math.ceil(totalUsers / pageLimit);
  const supplier: Supplier[] = dataRes.users;
  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Suppliers (${totalUsers})`}
            description="Manage employees (Server side table functionalities.)"
          />

          <Link
            href={"/dashboard/employee/new"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />

        <DataTable
          searchKey="name"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          data={supplier}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}
