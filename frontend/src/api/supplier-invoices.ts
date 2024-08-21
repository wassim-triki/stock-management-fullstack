"use server";
import { SupplierInvoiceFormValues } from "@/components/forms/supplier-invoice-form";
import fetchHelper from "@/lib/fetchInstance";
import {
  ApiSuccessResponse,
  ApiSuccessResponseList,
  QueryParams,
  SupplierInvoice,
} from "@/lib/types";
import { buildQueryParamsString } from "@/lib/utils";
import { revalidateTag } from "next/cache";

export const getSuppliersInvoices = async (
  queryParams?: QueryParams,
): Promise<SupplierInvoice[]> => {
  "use server";

  const queryParamsStr = await buildQueryParamsString(queryParams);

  const response: ApiSuccessResponseList<SupplierInvoice> = await fetchHelper(
    `/api/suppliers/invoices?${queryParamsStr.toString()}`,
    {
      next: { tags: ["suppliers-invoices"] },
    },
  );
  return response.data.items;
};

export const createSupplierInvoice = async (
  data: SupplierInvoiceFormValues,
): Promise<ApiSuccessResponse<SupplierInvoice>> => {
  revalidateTag("supplier-invoices");
  return await fetchHelper("/api/suppliers/invoices", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateSupplierInvoice = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<SupplierInvoiceFormValues>;
}): Promise<ApiSuccessResponse<SupplierInvoice>> => {
  revalidateTag("supplier-invoices");
  return await fetchHelper(`/api/suppliers/invoices/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const getSupplierInvoiceById = async (
  id: string,
): Promise<SupplierInvoice> => {
  const response: ApiSuccessResponse<SupplierInvoice> = await fetchHelper(
    `/api/suppliers/invoices/${id}`,
  );
  return response.data;
};

export const deleteSupplierInvoice = async (
  id: string,
): Promise<ApiSuccessResponse<SupplierInvoice>> => {
  revalidateTag("supplier-invoices");
  return await fetchHelper(`/api/suppliers/invoices/${id}`, {
    method: "DELETE",
  });
};

export const getTotalSupplierInvoices = async (): Promise<number> => {
  const response: ApiSuccessResponseList<Promise<number>> = await fetchHelper(
    `/api/suppliers/invoices/total`,
  );
  return response.data.total;
};
