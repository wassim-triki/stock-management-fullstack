import ContentPageLayout from "@/components/layouts/content-page-layout";
import { getSuppliers } from "@/api/supplier";
import SuppliersTable from "@/components/tables/suppliers-table/supplier-table";
import { queryKeys } from "@/lib/constants";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

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
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.suppliers],
    queryFn: getSuppliers,
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <ContentPageLayout
      breadcrumbItems={breadcrumbItems}
      addNewLink="/dashboard/suppliers/new"
      title={`Suppliers (${0})`}
      description="Manage suppliers"
    >
      <HydrationBoundary state={dehydratedState}>
        <SuppliersTable />
      </HydrationBoundary>
    </ContentPageLayout>
  );
}
