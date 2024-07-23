"use client";
import React from "react";
import { DataTable } from "../data-table";
import { columns } from "@/components/tables/users-table/columns";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/user";
import { queryKeys } from "@/lib/constants";

const UsersTable = () => {
  const { data } = useQuery({
    queryKey: [queryKeys.users],
    queryFn: getUsers,
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
