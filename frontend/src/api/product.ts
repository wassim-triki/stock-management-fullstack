import {
  ApiSuccessResponse,
  ApiSuccessResponseList,
  Product,
} from "@/lib/types";
import { ApiSearchFilter, buildQueryParams } from "./supplier";
import fetchHelper from "@/lib/fetchInstance";

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
