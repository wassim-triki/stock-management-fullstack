"use server";
import { axiosInstance } from "@/lib/axios";
import fetchHelper from "@/lib/fetchInstance";
import {
  ApiSearchFilter,
  ApiSuccessResponse,
  ApiSuccessResponseList,
  Supplier,
} from "@/lib/types";
import { buildQueryParams } from "@/lib/utils";
import { AxiosResponse } from "axios";

export const getSuppliers = async (
  filter: ApiSearchFilter,
): Promise<Supplier[]> => {
  "use server";

  const queryParams = await buildQueryParams(filter);

  const response: ApiSuccessResponseList<Supplier> = await fetchHelper(
    `/api/suppliers?${queryParams.toString()}`,
  );

  return response.data.items;
};

export const getSupplierById = async (id: string): Promise<Supplier> => {
  const response = await fetchHelper<ApiSuccessResponse<Supplier>>(
    `/api/suppliers/${id}`,
  );
  return response.data;
};
// Function to update supplier by ID
export const updateSupplier = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<Supplier>;
}): Promise<ApiSuccessResponse<Supplier>> => {
  return await fetchHelper(`/api/suppliers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Function to get the total number of suppliers
export const getTotalSuppliers = async (): Promise<number> => {
  const response: ApiSuccessResponse<{ total: number }> = await fetchHelper(
    "/api/suppliers/total",
  );
  return response.data.total;
};
// Function to delete supplier by ID
export const deleteSupplier = async (
  supplierId: string,
): Promise<ApiSuccessResponse<Supplier>> => {
  return await fetchHelper(`/api/suppliers/${supplierId}`, {
    method: "DELETE",
  });
};

export const createSupplier = async (
  data: Partial<Supplier>,
): Promise<ApiSuccessResponse<Supplier>> => {
  return await fetchHelper("/api/suppliers", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// export const getSupplierById = async (id: string): Promise<Supplier> => {
//   const response = await fetchHelper<ApiSuccessResponse<Supplier>>(
//     `/api/suppliers/${id}`,
//   );
//   return response.data;
// };
