import { getUserById } from "@/api/user";
import { UserForm } from "@/components/forms/user-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { queryKeys } from "@/lib/constants";
import { QueryClient } from "@tanstack/react-query";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Users", link: "/dashboard/users" },
  { title: "Edit", link: "" },
];

type Props = {
  params: { userId: string };
};

export default async function Page({ params }: Props) {
  const userId = params.userId;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.users, userId],
    queryFn: () => getUserById(userId),
  });

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <UserForm
          // initialData={res.data}
          roles={[
            { _id: "admin", name: "Admin" },
            // { _id: "user", name: "pants" },
            { _id: "manager", name: "Manager" },
          ]}
          userId={userId}
          action="Save Changes"
          description="Edit user information"
          title="Edit User"
        />
      </div>
    </ScrollArea>
  );
}
