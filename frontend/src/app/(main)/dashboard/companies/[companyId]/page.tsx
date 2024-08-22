import { SupplierForm } from "@/components/forms/supplier-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSupplierById } from "@/api/supplier";
import { Supplier, ApiErrorResponse } from "@/lib/types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCategories, getCategoryById } from "@/api/category";
import { CategoryForm } from "@/components/forms/category-form";
import { CompanyForm } from "@/components/forms/company-form";
import { getCompanyById } from "@/api/company";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Companies", link: "/dashboard/companies" },
  { title: "Edit", link: "" },
];

type Props = {
  params: { companyId: string };
};

export default async function Page({ params }: Props) {
  const companyId = params.companyId;

  const company = await getCompanyById(companyId);
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <CompanyForm
          initCompany={company}
          action="Save Changes"
          description="Edit company information"
          title="Edit Company"
        />
      </div>
    </ScrollArea>
  );
}
