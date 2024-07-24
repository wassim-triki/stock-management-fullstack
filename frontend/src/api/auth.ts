import { axiosInstance } from "@/lib/axios";
import fetchHelper from "@/lib/fetchInstance";
import { ApiSuccessResponse, User } from "@/lib/types";
import { AxiosResponse } from "axios";

export const getAuthUser = async (): Promise<ApiSuccessResponse<User>> => {
  return fetchHelper("/api/auth/me");
};
export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<ApiSuccessResponse<User>> => {
  return axiosInstance
    .post("/api/auth/login", { email, password })
    .then((response: AxiosResponse<ApiSuccessResponse<User>>) => response.data);
};

export const logoutUser = async (): Promise<ApiSuccessResponse> => {
  return fetchHelper("/api/auth/logout");
};
