"use client";
import React from "react";
import { DataTable } from "../data-table";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants";
import { getSuppliers } from "@/api/supplier";
import { Supplier } from "@/lib/types";
import { columns } from "./columns";

const UsersTable = () => {
  const { data } = useQuery({
    queryKey: [queryKeys.suppliers],
    queryFn: getSuppliers,
  });
  return (
    <DataTable
      searchKey="name"
      pageNo={1}
      columns={columns}
      data={data || []}
      pageCount={1}
    />
  );
};

export default UsersTable;
