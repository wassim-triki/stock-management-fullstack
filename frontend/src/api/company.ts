"use server";
import { CompanyFormValues } from "@/components/forms/company-form";
import fetchHelper from "@/lib/fetchInstance";
import {
  ApiSuccessResponse,
  ApiSuccessResponseList,
  Company,
  QueryParams,
} from "@/lib/types";
import { buildQueryParamsString } from "@/lib/utils";
import { revalidateTag } from "next/cache";

export const getCompanies = async (
  queryParams?: QueryParams,
): Promise<Company[]> => {
  "use server";

  const queryParamsStr = await buildQueryParamsString(queryParams);

  const response: ApiSuccessResponseList<Company> = await fetchHelper(
    `/api/companies?${queryParamsStr}`,
    {
      next: { tags: ["companies"] },
    },
  );

  return response.data.items;
};

export const getTotalCompanies = async (): Promise<number> => {
  const response: ApiSuccessResponseList<{ total: number }> = await fetchHelper(
    "/api/companies/total",
  );
  return response.data.total;
};

export const createCompany = async (
  company: CompanyFormValues,
): Promise<ApiSuccessResponse<Company>> => {
  revalidateTag("companies");
  const response: ApiSuccessResponse<Company> = await fetchHelper(
    "/api/companies",
    {
      method: "POST",
      body: JSON.stringify(company),
    },
  );
  return response;
};

export const updateCompany = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<CompanyFormValues>;
}): Promise<ApiSuccessResponse<Company>> => {
  revalidateTag("companies");
  const response: ApiSuccessResponse<Company> = await fetchHelper(
    `/api/companies/${id}`,
    { method: "PUT", body: JSON.stringify(data) },
  );
  return response;
};

export const deleteCompany = async (
  id: string,
): Promise<ApiSuccessResponse<Company>> => {
  revalidateTag("companies");
  const response: ApiSuccessResponse<Company> = await fetchHelper(
    `/api/companies/${id}`,
    { method: "DELETE" },
  );
  return response;
};

export const getCompanyById = async (id: string): Promise<Company> => {
  const response: ApiSuccessResponse<Company> = await fetchHelper(
    `/api/companies/${id}`,
  );
  return response.data;
};
