import { columns } from "@/components/tables/suppliers-table/columns";
import { ApiErrorResponse, Supplier } from "@/lib/types";
import { DataTable } from "@/components/tables/data-table";
import ContentPageLayout from "@/components/layouts/content-page-layout";
import { getSuppliers, getTotalSuppliers } from "@/api/supplier";
import { unstable_noStore } from "next/cache";
import SuppliersTable from "@/components/tables/suppliers-table/supplier-table";
import getQueryClient from "@/lib/getQueryClient";
import { queryKeys } from "@/lib/constants";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

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
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.user],
    queryFn: getSuppliers,
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <ContentPageLayout
      breadcrumbItems={breadcrumbItems}
      addNewLink="/dashboard/suppliers/new"
      title="Error"
      description="There was an error loading the suppliers."
    >
      <HydrationBoundary state={dehydratedState}>
        <SuppliersTable />
      </HydrationBoundary>
    </ContentPageLayout>
  );
}
