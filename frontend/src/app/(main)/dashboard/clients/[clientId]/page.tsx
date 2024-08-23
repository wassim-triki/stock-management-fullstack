import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getClientById } from "@/api/client";
import { ClientForm } from "@/components/forms/client-form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Clients", link: "/dashboard/clients" },
  { title: "Edit", link: "" },
];

type PageProps = {
  params: { clientId: string };
};

export default async function Page({ params }: PageProps) {
  const client = await getClientById(params.clientId);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <ClientForm
          initClient={client}
          action="Save changes"
          description="Edit client"
          title="Edit Client"
        />
      </div>
    </ScrollArea>
  );
}
