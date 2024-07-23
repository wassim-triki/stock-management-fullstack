import { Product } from "@/lib/types";
import { DataTable } from "@/components/tables/data-table";
import ContentPageLayout from "@/components/layouts/content-page-layout";
import { columns } from "@/components/tables/products-table/columns";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Products", link: "/dashboard/products" },
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
    `https://api.slingacademy.com/v1/sample-data/products?offset=${offset}&limit=${pageLimit}`,
  );
  const dataRes = await res.json();
  const totalUsers = dataRes.total_products; //1000
  const pageCount = Math.ceil(totalUsers / pageLimit);
  const product: Product[] = dataRes.products;
  return (
    <>
      <ContentPageLayout
        breadcrumbItems={breadcrumbItems}
        title={`Products (${totalUsers})`}
        description="Manage employees (Server side table functionalities.)"
        addNewLink="/dashboard/products/new"
      >
        <DataTable
          searchKey="name"
          pageNo={page}
          columns={columns}
          data={product}
          pageCount={pageCount}
        />
      </ContentPageLayout>
    </>
  );
}
