import { axiosInstance } from "@/lib/axios";
import { ApiSuccessResponse, User } from "@/lib/types";
import { AxiosResponse } from "axios";

export const getAuthUser = async (): Promise<ApiSuccessResponse<User>> => {
  const resp: AxiosResponse<ApiSuccessResponse<User>> =
    await axiosInstance.get("/api/auth/me");
  return resp.data;
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
  return axiosInstance
    .get("/api/auth/logout")
    .then((response: AxiosResponse<ApiSuccessResponse>) => response.data);
};
