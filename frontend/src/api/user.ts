"use server";
import { UserFormValues } from "@/components/forms/user-form";
import { axiosInstance } from "@/lib/axios";
import fetchHelper from "@/lib/fetchInstance";
import {
  ApiSearchFilter,
  ApiSuccessResponse,
  ApiSuccessResponseList,
  QueryParams,
  User,
} from "@/lib/types";
import { buildQueryParamsString } from "@/lib/utils";
import { AxiosResponse } from "axios";
import { revalidateTag } from "next/cache";

export async function getUsers(queryParams: QueryParams): Promise<User[]> {
  "use server";
  const queryParamsStr = await buildQueryParamsString(queryParams);
  const response: ApiSuccessResponseList<User> = await fetchHelper(
    `/api/users?${queryParamsStr.toString()}`,
    {
      next: { tags: ["users"] },
    },
  );
  return response.data.items;
}
export async function deleteUser(
  userId: string,
): Promise<ApiSuccessResponse<User>> {
  revalidateTag("users");
  return await fetchHelper(`/api/users/${userId}`, {
    method: "DELETE",
  });
}

// Function to get supplier by ID
export async function getUserById(id: string): Promise<User> {
  const response: ApiSuccessResponse<User> = await fetchHelper(
    `/api/users/${id}`,
  );
  return response.data;
}

export const createUser = async (
  data: UserFormValues,
): Promise<ApiSuccessResponse<User>> => {
  revalidateTag("users");
  return await fetchHelper("/api/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateUser = async ({
  id,
  data,
}: {
  id: string;
  data: UserFormValues;
}): Promise<ApiSuccessResponse<User>> => {
  revalidateTag("users");
  return await fetchHelper(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Function to get the total number of suppliers
export const getTotalUsers = async (): Promise<number> => {
  const response: ApiSuccessResponse<{ total: number }> =
    await fetchHelper("/api/users/total");
  return response.data.total;
};
