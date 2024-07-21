import axios, { AxiosError } from "axios";
import config from "@/lib/config";
import { ApiErrorResponse } from "../types";
import { cookies } from "next/headers";

const axiosServer = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: config.apiUrl, // Set your API base URL,
  withCredentials: true, // Ensure credentials are sent
});

// Request interceptor to include session cookie
axiosServer.interceptors.request.use((config) => {
  const cookieStore = cookies();
  const cookieValue = cookieStore.get("session")?.value;

  if (cookieValue) {
    config.headers.Cookie = `session=${cookieValue}`;
  }

  return config;
});

// Response interceptor to handle errors
axiosServer.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 404) {
      console.log("😁😁😁😁");
    } else if (error.response?.status) {
      // Handle other error statuses if needed
      console.log("👇👇👇👇 other", error.response.data, "☝️☝️☝️☝️");
    } else {
      // Handle generic errors
      console.log("😁😁😁😁 generic");
    }

    // Ensure the error response is always returned in a consistent format
    return Promise.reject(error.response?.data as ApiErrorResponse);
  },
);

export { axiosServer };
