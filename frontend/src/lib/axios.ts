import axios, { AxiosError } from "axios";
import { ApiErrorResponse } from "./types";
import config from "@/lib/config";
import { makeUseAxios } from "axios-hooks";
// Create a base URL
const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: config.apiUrl, // Set your API base URL,
  withCredentials: true, // Ensure credentials are sent
});

const useAxios = makeUseAxios({
  axios: axiosInstance,
});

// Utility function to handle redirection
const redirectToLogin = () => {
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) =>
    Promise.reject(error.response?.data as ApiErrorResponse),
);

export { axiosInstance, useAxios };
