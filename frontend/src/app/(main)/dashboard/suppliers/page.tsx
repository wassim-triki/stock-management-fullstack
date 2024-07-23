import { columns } from "@/components/tables/suppliers-table/columns";
import { ApiErrorResponse, Supplier } from "@/lib/types";
import { DataTable } from "@/components/tables/data-table";
import ContentPageLayout from "@/components/layouts/content-page-layout";
import { getSuppliers, getTotalSuppliers } from "@/api/supplier";
import { unstable_noStore } from "next/cache";
import SuppliersTable from "@/components/tables/suppliers-table/table";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Suppliers", link: "/dashboard/suppliers" },
];

type ParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: ParamsProps) {
  try {
    const res = await getTotalSuppliers();
    const total = res.data.total;

    return (
      <ContentPageLayout
        breadcrumbItems={breadcrumbItems}
        title={`Suppliers (${total})`}
        description="Manage employees (Server side table functionalities.)"
        addNewLink="/dashboard/suppliers/new"
      >
        <SuppliersTable />
      </ContentPageLayout>
    );
  } catch (error) {
    console.error(error);

    return (
      <ContentPageLayout
        breadcrumbItems={breadcrumbItems}
        addNewLink="/dashboard/suppliers/new"
        title="Error"
        description="There was an error loading the suppliers."
      >
        {/* TODO: change styles */}
        <div className="flex items-center justify-center py-48 text-slate-500">
          {(error as ApiErrorResponse)?.message}
        </div>
      </ContentPageLayout>
    );
  }
}
