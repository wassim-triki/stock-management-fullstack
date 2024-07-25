// fetchHelper.ts
"use server";
import config from "@/lib/config";
import { ApiErrorResponse } from "./types";
import { cookies } from "next/headers";

async function fetchHelper<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const cookieStore = cookies();
  const cookieValue = cookieStore.get("session")?.value;
  console.log("😂😂😂😂😂😂😂😂😂");
  const response = await fetch(`${config.apiUrl}${url}`, {
    credentials: "include", // Ensure credentials are sent
    headers: {
      "Content-Type": "application/json",
      Cookie: "session=" + cookieValue,
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json();
    // if (response.status === 401) {
    //   console.log("Unauthorized. Please login.");
    // } else {
    //   console.log(errorData.message || "Server error");
    // }
    throw new Error(errorData.message || "Server error");
    return Promise.reject(errorData);
  }

  return response.json() as Promise<T>;
}

export default fetchHelper;
