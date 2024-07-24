// fetchHelper.ts
"use server";
import config from "@/lib/config";
import { ApiErrorResponse } from "./types";
import { cookies } from "next/headers";
import appConfig from "./config";

async function fetchHelper<T>(url: string): Promise<T> {
  const cookieStore = cookies();
  const cookieValue = cookieStore.get("session")?.value;
  const response = await fetch(`${config.apiUrl}${url}`, {
    credentials: "include", // Ensure credentials are sent
    headers: {
      "Content-Type": "application/json",
      Cookie: "session=" + cookieValue,
    },
  });

  // return response.ok;
  return response.json() as Promise<T>;
}

export default fetchHelper;
