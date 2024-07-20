import axios, { AxiosError } from "axios";
import { message } from "antd";
import { IErrorResponse, ISuccessResponse } from "@/api/auth";

// Create a base URL
const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000", // Set your API base URL
  withCredentials: true, // Ensure credentials are sent
});

// Utility function to handle redirection
const redirectToLogin = () => {
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

export type IApiResponse = IErrorResponse | ISuccessResponse;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) =>
    Promise.reject((error.response?.data as IErrorResponse).error),
);

export default axiosInstance;
