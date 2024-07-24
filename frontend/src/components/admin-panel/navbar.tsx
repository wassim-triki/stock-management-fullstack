import { ModeToggle } from "@/components/mode-toggle";
import UserNav from "@/components/admin-panel/user-nav";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants";
import { getAuthUser } from "@/api/auth";

interface NavbarProps {
  title?: string;
}

export async function Navbar({ title }: NavbarProps) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.auth],
    queryFn: getAuthUser,
  });

  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 flex h-14 items-center sm:mx-8">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ModeToggle />
          <HydrationBoundary state={dehydrate(queryClient)}>
            <UserNav />
          </HydrationBoundary>
        </div>
      </div>
    </header>
  );
}
