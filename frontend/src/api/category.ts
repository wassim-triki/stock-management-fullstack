import {
  ApiSuccessResponse,
  ApiSuccessResponseList,
  Category,
} from "@/lib/types";
import { ApiSearchFilter, buildQueryParams } from "./supplier";
import fetchHelper from "@/lib/fetchInstance";

export const getCategories = async (
  filter: ApiSearchFilter,
): Promise<Category[]> => {
  "use server";

  const queryParams = await buildQueryParams(filter);

  const response: ApiSuccessResponseList<Category> = await fetchHelper(
    `/api/categories?${queryParams.toString()}`,
  );

  return response.data.items;
};

export const getTotalCategories = async (): Promise<number> => {
  const response: ApiSuccessResponse<{ total: number }> = await fetchHelper(
    "/api/categories/total",
  );
  return response.data.total;
};
