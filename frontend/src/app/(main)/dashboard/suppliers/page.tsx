import ContentPageLayout from "@/components/layouts/content-page-layout";
import {
  ApiSearchFilter,
  getSuppliers,
  getTotalSuppliers,
} from "@/api/supplier";
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
  const page = Number(searchParams.page) || 1;

  const limit = Number(searchParams.limit) || 5;
  const search = searchParams.search?.toString() || "";
  const offset = (page - 1) * limit;

  const filter: ApiSearchFilter = {
    limit,
    offset,
    search,
  };

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.suppliers, filter],
    queryFn: () => getSuppliers(filter),
  });

  const total = await queryClient.fetchQuery({
    queryKey: [queryKeys.totalSuppliers],
    queryFn: getTotalSuppliers,
  });

  const pageCount = Math.ceil(total / limit);

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <ContentPageLayout
        breadcrumbItems={breadcrumbItems}
        addNewLink="/dashboard/suppliers/new"
        title={`Suppliers (${total})`}
        description="Manage suppliers"
      >
        <SuppliersTable
          pageCount={pageCount}
          filter={{ limit, offset, search }}
        />
      </ContentPageLayout>
    </HydrationBoundary>
  );
}
