import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

function TableCellLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link className={cn(className)} href={href}>
      <span className="text-blue-500/80 hover:underline">{children}</span>
    </Link>
  );
}

export default TableCellLink;
