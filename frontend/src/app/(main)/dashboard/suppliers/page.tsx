import { columns } from "@/components/tables/suppliers-table/columns";
import { ApiErrorResponse, Supplier } from "@/lib/types";
import { DataTable } from "@/components/tables/data-table";
import ContentPageLayout from "@/components/layouts/content-page-layout";
import { getSuppliers } from "@/api/supplier";

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
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const country = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  try {
    const res = await getSuppliers();
    const suppliers = res.data.items;
    const totalUsers = res.data.total || 0;
    const pageCount = Math.ceil(totalUsers / pageLimit);

    return (
      <ContentPageLayout
        breadcrumbItems={breadcrumbItems}
        title={`Suppliers (${totalUsers})`}
        description="Manage employees (Server side table functionalities.)"
        addNewLink="/dashboard/suppliers/new"
      >
        <DataTable
          searchKey="name"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          data={suppliers}
          pageCount={pageCount}
        />
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
          {(error as ApiErrorResponse).message}
        </div>
      </ContentPageLayout>
    );
  }
}
