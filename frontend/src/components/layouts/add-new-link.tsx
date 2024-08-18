"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";
import { Plus } from "lucide-react";

function AddNewLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant: "default", size: "default" }))}
    >
      <Plus className="mr-2 h-4 w-4" /> Add New
    </Link>
  );
}

export default AddNewLink;
