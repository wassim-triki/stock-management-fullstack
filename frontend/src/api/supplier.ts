import { axiosInstance } from "@/lib/axios";
import {
  ApiSuccessResponse,
  ApiSuccessResponseList,
  Supplier,
} from "@/lib/types";
import { AxiosResponse } from "axios";

// Function to get all suppliers
export const getSuppliers = async (): Promise<Supplier[]> => {
  return axiosInstance
    .get("/api/suppliers")
    .then(
      (response: AxiosResponse<ApiSuccessResponseList<Supplier>>) =>
        response.data.data.items,
    );
};

// Function to get supplier by ID
export const getSupplierById = async (id: string): Promise<Supplier> => {
  return axiosInstance
    .get(`/api/suppliers/${id}`)
    .then(
      (response: AxiosResponse<ApiSuccessResponse<Supplier>>) =>
        response.data.data,
    );
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
export const getTotalSuppliers = async (): Promise<
  ApiSuccessResponse<{ total: number }>
> => {
  return axiosInstance
    .get("/api/suppliers/total")
    .then(
      (response: AxiosResponse<ApiSuccessResponse<{ total: number }>>) =>
        response.data,
    );
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
