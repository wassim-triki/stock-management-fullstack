"use server";
import {
  ApiSearchFilter,
  ApiSuccessResponse,
  ApiSuccessResponseList,
  Category,
  QueryParams,
} from "@/lib/types";
import fetchHelper from "@/lib/fetchInstance";
import { buildQueryParamsString } from "@/lib/utils";

export const getCategories = async (
  queryParams?: QueryParams,
): Promise<Category[]> => {
  "use server";

  const queryParamsStr = await buildQueryParamsString(queryParams);

  const response: ApiSuccessResponseList<Category> = await fetchHelper(
    `/api/categories?${queryParamsStr}`,
  );

  return response.data.items;
};

export const getTotalCategories = async (): Promise<number> => {
  const response: ApiSuccessResponse<{ total: number }> = await fetchHelper(
    "/api/categories/total",
  );
  return response.data.total;
};

export const createCategory = async (data: {
  name: string;
  parentCategory: string | null;
}): Promise<ApiSuccessResponse<Category>> => {
  return await fetchHelper("/api/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateCategory = async ({
  id,
  data,
}: {
  id: string;
  data: {
    name: string;
    parentCategory: string | null;
  };
}): Promise<ApiSuccessResponse<Category>> => {
  return await fetchHelper(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteCategory = async (
  categoryId: string,
): Promise<ApiSuccessResponse<Category>> => {
  return await fetchHelper(`/api/categories/${categoryId}`, {
    method: "DELETE",
  });
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const response: ApiSuccessResponse<Category> = await fetchHelper(
    `/api/categories/${id}`,
  );
  return response.data;
};
