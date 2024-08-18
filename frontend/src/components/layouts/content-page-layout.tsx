import React from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "../ui/button";
import AddNewLink from "./add-new-link";

type ContentPageLayoutProps = {
  breadcrumbItems: { title: string; link: string }[];
  title: string;
  description: string;
  addNewLink: string;
  children: React.ReactNode;
};

const ContentPageLayout: React.FC<ContentPageLayoutProps> = ({
  breadcrumbItems,
  title,
  description,
  addNewLink,
  children,
}) => {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading title={title} description={description} />
        <AddNewLink href={addNewLink} />
      </div>
      <Separator />
      {children}
    </div>
  );
};

export default ContentPageLayout;
