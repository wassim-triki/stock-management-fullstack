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
import { getCompanyById, getCompanyByUserId } from "@/api/company";
import { getAuthUser } from "@/api/auth";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "My Company", link: "/dashboard/settings/my-company" },
];

export default async function Page() {
  const auth = await getAuthUser();
  console.log(auth);

  const company = await getCompanyByUserId(auth.data._id);
  if (!company) {
    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-8">
          <Breadcrumbs items={breadcrumbItems} />
          <CompanyForm
            action="Create Company"
            description="Create your company"
            title="Create Company"
          />
        </div>
      </ScrollArea>
    );
  }
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
