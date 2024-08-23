import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClientForm } from "@/components/forms/client-form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Clients", link: "/dashboard/clients" },
  { title: "Create", link: "/dashboard/clients/new" },
];

export default async function Page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <ClientForm
          action="Create"
          description="Create a new client"
          title="Create Client"
        />
      </div>
    </ScrollArea>
  );
}
