"use server";
import config from "@/lib/config";
import { ApiErrorResponse } from "./types";
import { cookies } from "next/headers";

async function fetchPDFHelper(
  url: string,
  options: RequestInit = {},
): Promise<Blob> {
  const cookieStore = cookies();
  const cookieValue = cookieStore.get("session")?.value;
  const response = await fetch(`${config.apiUrl}${url}`, {
    credentials: "include", // Ensure credentials are sent
    headers: {
      "Content-Type": "application/pdf", // This remains since we're sending JSON in requests
      Cookie: "session=" + cookieValue,

      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    try {
      const errorData: ApiErrorResponse = await response.json();
      throw new Error(errorData.message || "Server error");
    } catch (error) {
      throw new Error("Server error occurred");
    }
  }

  // Return the response as a Blob
  return response.blob();
}

export default fetchPDFHelper;
