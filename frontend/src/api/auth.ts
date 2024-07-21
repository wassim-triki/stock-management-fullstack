import config from "@/lib/config";
import { User } from "@/lib/types";
import axios, { AxiosResponse } from "axios";
import { cookies } from "next/headers";

export const getAuthUser = async (): Promise<User | null> => {
  try {
    const cookieStore = cookies();
    const cookieValue = cookieStore.get("session")?.value;
    const resp: AxiosResponse = await axios.get("/api/auth/me", {
      baseURL: config.apiUrl,
      headers: {
        Cookie: "session=" + cookieValue,
      },
    });
    return resp.data.payload.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
