"use client";
import React, { useEffect } from "react";
import { DataTable } from "../data-table";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants";
import { useDebounce } from "@uidotdev/usehooks";
import {
  ApiSearchFilter,
  getSuppliers,
  getTotalSuppliers,
} from "@/api/supplier";
import { columns } from "./columns";

interface SuppliersTableProps {
  pageCount: number;
  filter: ApiSearchFilter;
}

const SuppliersTable = ({ pageCount, filter }: SuppliersTableProps) => {
  const [searcFilter, setSearchFilter] = React.useState(filter);
  const debouncedFilter = useDebounce(searcFilter, 500);
  const { data } = useQuery({
    queryKey: [queryKeys.suppliers, debouncedFilter],
    queryFn: () => getSuppliers(debouncedFilter),
  });

  return (
    <DataTable
      searchKey="companyName"
      columns={columns}
      data={data || []}
      pageCount={pageCount}
    />
  );
};

export default SuppliersTable;
