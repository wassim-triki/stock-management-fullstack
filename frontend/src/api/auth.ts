import config from "@/lib/config";
import fetchHelper from "@/lib/fetchInstance";
import { ApiSuccessResponse, User } from "@/lib/types";
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
  return await fetch(`${config.apiUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  }).then((res) => res.json());
};

export const logoutUser = async (): Promise<ApiSuccessResponse> => {
  return await fetchHelper("/api/auth/logout");
};
