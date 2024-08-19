import Link from "next/link";
import React from "react";

function TableCellLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <span className="text-blue-500/80 hover:underline">{children}</span>
    </Link>
  );
}

export default TableCellLink;
