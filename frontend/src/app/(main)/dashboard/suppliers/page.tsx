import { columns } from "@/components/tables/suppliers-table/columns";
import { Supplier } from "@/lib/types";
import { DataTable } from "@/components/tables/data-table";
import ContentPageLayout from "@/components/layouts/content-page-layout";
import { getSuppliers } from "@/api/supplier";

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

  // const res = await fetch(
  //   `https://api.slingacademy.com/v1/sample-data/users?offset=${offset}&limit=${pageLimit}` +
  //     (country ? `&search=${country}` : ""),
  // );
  const res = await getSuppliers();
  // const dataRes = await res.json();
  console.log("page:", res);
  const suppliers: Supplier[] = res.data.items;
  const totalUsers =
    (res.data as { total: number; items: Supplier[] }).total || 0; //1000
  const pageCount = Math.ceil(totalUsers / pageLimit);
  // TODO: Implement pagination
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
      <div className="flex items-center justify-center py-48 text-slate-500">
        {res.message}
      </div>
    </ContentPageLayout>
  );
}
