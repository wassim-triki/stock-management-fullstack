"use client";
import React, { useEffect } from "react";
import { DataTable } from "../data-table";
import { useAxios } from "@/lib/axios/axios-client";
import {
  ApiErrorResponse,
  ApiSuccessResponseList,
  Supplier,
} from "@/lib/types";
import { columns } from "@/components/tables/suppliers-table/columns";
import { useParams } from "next/navigation";
const SuppliersTable = () => {
  const [
    { data: res, loading: suppliersLoading, error: suppliersError },
    executePut,
  ] = useAxios<
    ApiSuccessResponseList<Supplier>,
    Partial<Supplier>,
    ApiErrorResponse
  >({
    url: "/api/suppliers",
    method: "GET",
  });

  const params = useParams();

  const page = Number(params.page) || 1;
  const pageLimit = Number(params.limit) || 10;
  const country = params.search || null;
  const offset = (page - 1) * pageLimit;

  const total = res?.data.total || 0;
  const pageCount = Math.ceil(total / pageLimit);
  const suppliers = res?.data.items || [];
  return suppliersLoading ? (
    <div>Loading...</div>
  ) : suppliersError ? (
    <div>Error: {suppliersError.message}</div>
  ) : (
    <DataTable
      searchKey="name"
      pageNo={page}
      columns={columns}
      data={suppliers}
      pageCount={pageCount}
    />
  );
};

export default SuppliersTable;
