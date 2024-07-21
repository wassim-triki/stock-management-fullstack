import { axiosServer } from "@/lib/axios/axios-server";
import { User } from "@/lib/types";
import { AxiosResponse } from "axios";

export const getAuthUser = async (): Promise<User | null> => {
  try {
    const resp: AxiosResponse = await axiosServer.get("/api/auth/me");
    return resp.data;
  } catch (error) {
    console.error("getAuthUser:", error);
    return null;
  }
};
