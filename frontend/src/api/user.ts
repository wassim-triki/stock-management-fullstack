"use server";
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

export async function getUsers(queryParams: QueryParams): Promise<User[]> {
  "use server";
  const queryParamsStr = await buildQueryParamsString(queryParams);
  const response: ApiSuccessResponseList<User> = await fetchHelper(
    `/api/users?${queryParamsStr.toString()}`,
  );
  return response.data.items;
}
export async function deleteUser(
  userId: string,
): Promise<ApiSuccessResponse<User>> {
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

export type CreateUserData = {
  email: string;
  password?: string;
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  role: string;
  active: boolean;
};

export const createUser = async (
  data: CreateUserData,
): Promise<ApiSuccessResponse<User>> => {
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
  data: Partial<User>;
}): Promise<ApiSuccessResponse<User>> => {
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
