import { axiosInstance } from "@/lib/axios";
import { ApiSuccessResponse, ApiSuccessResponseList, User } from "@/lib/types";
import { AxiosResponse } from "axios";

export async function getUsers(): Promise<User[]> {
  return axiosInstance
    .get(`/api/users`)
    .then(
      (response: AxiosResponse<ApiSuccessResponseList<User>>) =>
        response.data.data.items,
    );
}
export async function deleteUser(
  userId: string,
): Promise<ApiSuccessResponse<User>> {
  return axiosInstance
    .delete(`/api/users/${userId}`)
    .then((response: AxiosResponse<ApiSuccessResponse<User>>) => response.data);
}

// Function to get supplier by ID
export const getUserById = async (id: string): Promise<User> => {
  return axiosInstance
    .get(`/api/users/${id}`)
    .then(
      (response: AxiosResponse<ApiSuccessResponse<User>>) => response.data.data,
    );
};

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
