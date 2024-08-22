// "use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Footer } from "@/components/admin-panel/footer";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { Navbar } from "./navbar";
import AdminPanelContent from "./admin-panel-content";
import { getAuthUser } from "@/api/auth";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
  isForm?: boolean;
}) {
  const user = await getAuthUser();
  return (
    <>
      <Navbar />
      <Sidebar user={user.data} />
      <AdminPanelContent>{children}</AdminPanelContent>
      {/* <footer
        className={cn(
          "transition-[margin-left] duration-300 ease-in-out",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72",
        )}
      >
        <Footer />
      </footer> */}
    </>
  );
}
