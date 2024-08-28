"use server";
import {
  AccountInfoFormValues,
  ChangePasswordFormValues,
} from "@/components/forms/account-form";
import { SignupFormValues } from "@/components/signup";
import { axiosInstance } from "@/lib/axios";
import config from "@/lib/config";
import fetchHelper from "@/lib/fetchInstance";
import { ApiSuccessResponse, Currency, User } from "@/lib/types";
import { AxiosResponse } from "axios";
import { revalidateTag } from "next/cache";
export const getAuthUser = async (): Promise<ApiSuccessResponse<User>> => {
  return await fetchHelper("/api/auth/me", {
    next: { tags: ["auth"] },
  });
};
export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<ApiSuccessResponse<User>> => {
  revalidateTag("auth");
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
  revalidateTag("auth");
  return await fetchHelper("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const changePassword = async (
  data: ChangePasswordFormValues,
): Promise<ApiSuccessResponse> => {
  revalidateTag("auth");
  return await fetchHelper("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const changeEmail = async (
  email: string,
): Promise<ApiSuccessResponse<{ email: string }>> => {
  revalidateTag("auth");
  return await fetchHelper("/api/auth/change-email", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const changeInfo = async (
  data: AccountInfoFormValues,
): Promise<
  ApiSuccessResponse<{
    profile: {
      firstName: string;
      lastName: string;
      currency: Currency;
      address: string;
    };
  }>
> => {
  revalidateTag("auth");
  return await fetchHelper("/api/auth/change-info", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const sendPasswordResetEmail = async (
  email: string,
): Promise<ApiSuccessResponse> => {
  return await fetchHelper("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const resetPasswordRequest = async (
  token: string,
  password: string,
): Promise<ApiSuccessResponse> => {
  revalidateTag("auth");
  return await fetchHelper(`/api/auth/reset-password/${token}`, {
    method: "PUT",
    body: JSON.stringify({ password }),
  });
};
