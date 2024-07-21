// import { axiosSSR } from "@/lib/axios";
import { axiosServer } from "@/lib/axios/axios-server";
import config from "@/lib/config";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  ApiSuccessResponseList,
  Supplier,
} from "@/lib/types";
import { AxiosResponse } from "axios";
import { cookies } from "next/headers";

// Function to get all suppliers
export const getSuppliers = async (): Promise<
  ApiSuccessResponseList<Supplier>
> => {
  const resp: AxiosResponse<ApiSuccessResponseList<Supplier>> =
    await axiosServer.get("/api/suppliers/", {
      // query URL without using browser cache
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  return resp.data;
};

// Function to get supplier by ID
export const getSupplierById = async (
  id: string,
): Promise<ApiSuccessResponse<Supplier>> => {
  const resp: AxiosResponse<ApiSuccessResponse<Supplier>> =
    await axiosServer.get(`/api/suppliers/${id}`, {
      // query URL without using browser cache
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  return resp.data;
};

// Function to update supplier by ID
export const updateSupplier = async (
  id: string,
  data: Partial<Supplier>,
): Promise<ApiSuccessResponse<Supplier>> => {
  const resp: AxiosResponse<ApiSuccessResponse<Supplier>> =
    await axiosServer.put(`/api/suppliers/${id}`, data);
  return resp.data;
};
