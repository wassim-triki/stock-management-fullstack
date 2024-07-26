"use server";
import {
  ApiSearchFilter,
  ApiSuccessResponse,
  ApiSuccessResponseList,
  Product,
} from "@/lib/types";
import fetchHelper from "@/lib/fetchInstance";
import { buildQueryParams } from "@/lib/utils";

export const getProducts = async (
  filter: ApiSearchFilter,
): Promise<Product[]> => {
  "use server";

  const queryParams = await buildQueryParams(filter);

  const response: ApiSuccessResponseList<Product> = await fetchHelper(
    `/api/products?${queryParams.toString()}`,
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
  console.log(response.data);
  return response.data;
};
