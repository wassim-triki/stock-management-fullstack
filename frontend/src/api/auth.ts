import { SignupFormValues } from "@/components/signup";
import { axiosInstance } from "@/lib/axios";
import config from "@/lib/config";
import fetchHelper from "@/lib/fetchInstance";
import { ApiSuccessResponse, User } from "@/lib/types";
import { AxiosResponse } from "axios";
export const getAuthUser = async (): Promise<ApiSuccessResponse<User>> => {
  return await fetchHelper("/api/auth/me");
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
  return await fetchHelper("/api/auth/logout");
};

export const signUpUser = async (
  data: SignupFormValues,
): Promise<ApiSuccessResponse<User>> => {
  return await fetchHelper("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
