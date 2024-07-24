import { axiosInstance } from "@/lib/axios";
import fetchHelper from "@/lib/fetchInstance";
import { ApiSuccessResponse, ApiSuccessResponseList, User } from "@/lib/types";
import { AxiosResponse } from "axios";

export async function getUsers(): Promise<User[]> {
  const response: ApiSuccessResponseList<User> =
    await fetchHelper(`/api/users`);
  return response.data.items;
}
export async function deleteUser(
  userId: string,
): Promise<ApiSuccessResponse<User>> {
  return axiosInstance
    .delete(`/api/users/${userId}`)
    .then((response: AxiosResponse<ApiSuccessResponse<User>>) => response.data);
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
  return axiosInstance
    .post("/api/users", data)
    .then((response: AxiosResponse<ApiSuccessResponse<User>>) => response.data);
};

export const updateUser = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<User>;
}): Promise<ApiSuccessResponse<User>> => {
  return axiosInstance
    .put(`/api/users/${id}`, data)
    .then((response: AxiosResponse<ApiSuccessResponse<User>>) => response.data);
};

// Function to get the total number of suppliers
export const getTotalUsers = async (): Promise<number> => {
  const response: ApiSuccessResponse<{ total: number }> =
    await fetchHelper("/api/users/total");
  return response.data.total;
};
