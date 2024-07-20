import { axiosInstance } from "@/lib/axios";
import { User } from "@/lib/types";
import { AxiosResponse } from "axios";
import { cookies } from "next/headers";

export const getAuthUser = async (): Promise<User | null> => {
  try {
    const cookieStore = cookies();
    const cookieValue = cookieStore.get("session")?.value;
    const resp: AxiosResponse = await axiosInstance.get("/api/auth/me", {
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
