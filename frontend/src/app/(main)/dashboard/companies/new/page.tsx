import { getCompanies } from "@/api/company";
import { CompanyForm } from "@/components/forms/company-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Companies", link: "/dashboard/companies" },
  { title: "Create", link: "" },
];

export default async function Page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <CompanyForm
          action="Create"
          description="Create a new company"
          title="Create Company"
        />
      </div>
    </ScrollArea>
  );
}
