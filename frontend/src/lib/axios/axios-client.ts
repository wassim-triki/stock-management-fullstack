import axios, { AxiosError } from "axios";
import config from "@/lib/config";
import { configure, makeUseAxios } from "axios-hooks";
import { ApiErrorResponse } from "../types";
import { toast } from "@/components/ui/use-toast";

const axiosClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: config.apiUrl, // Set your API base URL,
  withCredentials: true, // Ensure credentials are sent
});

const useAxios = makeUseAxios({
  axios: axiosClient,
  cache: false,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 404) {
      console.log("😁😁😁😁");
    } else if (error.response?.status) {
      // Handle other error statuses if needed
      toast({
        title: "Error",
        description: error.response?.data.message,
      });
    }

    // Ensure the error response is always returned in a consistent format
    return Promise.reject(error.response?.data as ApiErrorResponse);
  },
);
export { axiosClient, useAxios };
