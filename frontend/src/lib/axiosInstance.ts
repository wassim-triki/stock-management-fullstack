import axios, { AxiosError } from "axios";
import { message } from "antd";

// Create a base URL
const axiosInstance = axios.create({
  // baseURL: process.env.API_URL, // Set your API base URL
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Set your API base URL
});

// Utility function to handle redirection
const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

// Set up interceptors
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     if (error.response) {
//       switch (error.response.status) {
//         case 401:
//           // Handle unauthorized error
//           await message.error("Unauthorized. Redirecting to login.");
//           // Add logic to remove stored tokens if any
//           redirectToLogin();
//           break;
//         case 422:
//           // Handle validation error
//           // const validationErrors: string[] = response.data.errors;
//           // if (validationErrors) {
//           //   await Promise.all(
//           //     validationErrors.map((err) => message.error(err)),
//           //   );
//           // } else {
//           await message.error("Validation error.");
//           // }
//           break;
//         case 403:
//           // Handle forbidden error
//           await message.error(
//             "Forbidden. You do not have permission to perform this action.",
//           );
//           break;
//         case 404:
//           // Handle not found error
//           await message.error("Resource not found.");
//           break;
//         default:
//           // Handle other errors
//           await message.error("An unexpected error occurred.");
//           break;
//       }
//     } else {
//       // Handle network or other errors
//       await message.error("Network error. Please try again.");
//     }
//     return Promise.reject(error);
//   },
// );

export default axiosInstance;
