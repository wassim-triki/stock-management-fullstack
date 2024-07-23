import axios, { AxiosError } from "axios";
import config from "@/lib/config";
import { toast } from "@/components/ui/use-toast";
import { ApiErrorResponse } from "./types";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: config.apiUrl, // Set your API base URL,
  withCredentials: true, // Ensure credentials are sent
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    console.log(error);
    toast({
      variant: "destructive",
      title: error.response?.data?.message || error.message || "Server error",
    });

    // Ensure the error response is always returned in a consistent format
    return Promise.reject(error.response?.data);
  },
);
export { axiosInstance };
