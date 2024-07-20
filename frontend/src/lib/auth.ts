// utils/auth.ts
import { GetServerSidePropsContext } from "next";
import { IErrorResponse, ISuccessResponse } from "@/api/auth";
import axiosInstance, { IApiResponse } from "./axiosInstance";
import { AxiosError } from "axios";
type ApiResponse = IErrorResponse | ISuccessResponse;

export async function checkAuth(): Promise<ISuccessResponse | undefined> {
  // ctx: GetServerSidePropsContext,
  // Assuming the session is stored in a cookie called 'session'

  try {
    const response = await axiosInstance.get("/api/auth/check-session", {
      withCredentials: true, // Ensure credentials are sent
    });
    const apiResponse: ISuccessResponse = response.data as ISuccessResponse;
    return apiResponse;
  } catch (error) {
    console.log(error);
  }
}
