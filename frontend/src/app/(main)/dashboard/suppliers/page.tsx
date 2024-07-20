import { columns } from "@/components/tables/suppliers-table/columns";
import { Supplier } from "@/lib/types";
import { DataTable } from "@/components/tables/data-table";
import ContentPageLayout from "@/components/layouts/content-page-layout";

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
        data={supplier}
        pageCount={pageCount}
      />
    </ContentPageLayout>
  );
}
