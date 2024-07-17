import axios, { AxiosError } from "axios";
import { message } from "antd";

// Create a base URL
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Set your API base URL
});

// Utility function to handle redirection
const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

// Set up interceptors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      const errorMessage = (data as { error: { message: string } }).error
        .message;

      switch (
        status
        // case 400:
        //   // Handle bad request error
        //   await message.error(errorMessage || "Bad request.");
        //   break;
        // case 401:
        //   // Handle unauthorized error
        //   await message.error(errorMessage || "Unauthorized. Redirecting to login.");
        //   // Add logic to remove stored tokens if any
        //   redirectToLogin();
        //   break;
        // case 403:
        //   // Handle forbidden error
        //   await message.error(errorMessage || "Forbidden. You do not have permission to perform this action.");
        //   break;
        // case 404:
        //   // Handle not found error
        //   await message.error(errorMessage || "Resource not found.");
        //   break;
        // default:
        //   // Handle other errors
        //   await message.error(errorMessage || "An unexpected error occurred.");
        //   break;
      ) {
      }
    } else {
      // Handle network or other errors
      await message.error("Network error. Please try again.");
    }

    // Stop the process by rejecting the promise with the intercepted error
    return Promise.reject(error);
  },
);

export default axiosInstance;
