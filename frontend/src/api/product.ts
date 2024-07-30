"use server";
import {
  ApiSearchFilter,
  ApiSuccessResponse,
  ApiSuccessResponseList,
  Product,
  QueryParams,
} from "@/lib/types";
import fetchHelper from "@/lib/fetchInstance";
import { buildQueryParamsString } from "@/lib/utils";

export const getProducts = async (
  queryParams: QueryParams,
): Promise<Product[]> => {
  "use server";

  const queryParamsStr = await buildQueryParamsString(queryParams);

  const response: ApiSuccessResponseList<Product> = await fetchHelper(
    `/api/products?${queryParamsStr.toString()}`,
  );

  return response.data.items;
};

export const getTotalProducts = async (): Promise<number> => {
  const response: ApiSuccessResponse<{ total: number }> = await fetchHelper(
    "/api/products/total",
  );
  return response.data.total;
};

export const createProduct = async (data: {
  name: string;
  price: number;
  category: string;
  supplier: string;
  quantityInStock: number;
}): Promise<ApiSuccessResponse<Product>> => {
  return await fetchHelper("/api/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateProduct = async ({
  id,
  data,
}: {
  id: string;
  data: {
    name: string;
    price: number;
    category: string;
    supplier: string;
    quantityInStock: number;
  };
}): Promise<ApiSuccessResponse<Product>> => {
  return await fetchHelper(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteProduct = async (
  productId: string,
): Promise<ApiSuccessResponse<Product>> => {
  return await fetchHelper(`/api/products/${productId}`, {
    method: "DELETE",
  });
};

export const getProductById = async (id: string): Promise<Product> => {
  const response: ApiSuccessResponse<Product> = await fetchHelper(
    `/api/products/${id}`,
  );
  return response.data;
};

export const getProductsBySupplier = async (
  supplierId: string,
): Promise<Product[]> => {
  const response: ApiSuccessResponseList<Product> = await fetchHelper(
    `/api/products?supplier=${supplierId}`,
  );
  return response.data.items;
};
