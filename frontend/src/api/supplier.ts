import { axiosInstance } from "@/lib/axios";
import fetchHelper from "@/lib/fetchInstance";
import {
  ApiSuccessResponse,
  ApiSuccessResponseList,
  Supplier,
} from "@/lib/types";
import { AxiosResponse } from "axios";

export const getSuppliers = async (): Promise<Supplier[]> => {
  const response: ApiSuccessResponseList<Supplier> =
    await fetchHelper("/api/suppliers");
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
  return axiosInstance
    .put(`/api/suppliers/${id}`, data)
    .then(
      (response: AxiosResponse<ApiSuccessResponse<Supplier>>) => response.data,
    );
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
  return axiosInstance
    .delete(`/api/suppliers/${supplierId}`)
    .then(
      (response: AxiosResponse<ApiSuccessResponse<Supplier>>) => response.data,
    );
};

export const createSupplier = async (
  data: Partial<Supplier>,
): Promise<ApiSuccessResponse<Supplier>> => {
  return axiosInstance
    .post("/api/suppliers", data)
    .then(
      (response: AxiosResponse<ApiSuccessResponse<Supplier>>) => response.data,
    );
};
