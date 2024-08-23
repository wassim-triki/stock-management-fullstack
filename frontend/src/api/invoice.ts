"use server";
import { InvoiceFormValues } from "@/components/forms/invoice-form";
import fetchHelper from "@/lib/fetchInstance";
import {
  ApiSuccessResponse,
  ApiSuccessResponseList,
  QueryParams,
  Invoice,
} from "@/lib/types";
import { buildQueryParamsString } from "@/lib/utils";
import { revalidateTag } from "next/cache";

// Get invoices (for both suppliers and clients)
export const getInvoices = async (
  queryParams?: QueryParams,
): Promise<Invoice[]> => {
  const queryParamsStr = await buildQueryParamsString(queryParams);

  const response: ApiSuccessResponseList<Invoice> = await fetchHelper(
    `/api/invoices?${queryParamsStr.toString()}`, // Generalize endpoint
    {
      next: { tags: ["invoices"] },
    },
  );
  return response.data.items;
};

// Create invoice (for both supplier and client)
export const createInvoice = async (
  data: InvoiceFormValues,
): Promise<ApiSuccessResponse<Invoice>> => {
  revalidateTag("invoices");
  return await fetchHelper("/api/invoices", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update invoice (supplier or client)
export const updateInvoice = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<InvoiceFormValues>;
}): Promise<ApiSuccessResponse<Invoice>> => {
  revalidateTag("invoices");
  return await fetchHelper(`/api/invoices/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Get a single invoice by ID
export const getInvoiceById = async (id: string): Promise<Invoice> => {
  const response: ApiSuccessResponse<Invoice> = await fetchHelper(
    `/api/invoices/${id}`,
  );
  return response.data;
};

// Delete invoice
export const deleteInvoice = async (
  id: string,
): Promise<ApiSuccessResponse<Invoice>> => {
  revalidateTag("invoices");
  return await fetchHelper(`/api/invoices/${id}`, {
    method: "DELETE",
  });
};

// Get total number of invoices
export const getTotalInvoices = async (): Promise<number> => {
  const response: ApiSuccessResponseList<Promise<number>> =
    await fetchHelper(`/api/invoices/total`);
  return response.data.total;
};
