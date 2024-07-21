// import { axiosSSR } from "@/lib/axios";
import { axiosServer } from "@/lib/axios/axios-server";
import config from "@/lib/config";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  ApiSuccessResponseList,
  Supplier,
} from "@/lib/types";
import { AxiosResponse } from "axios";
import { cookies } from "next/headers";

export const getSuppliers = async (): Promise<
  ApiSuccessResponseList<Supplier>
> => {
  const resp: AxiosResponse = await axiosServer.get("/api/suppliers/");
  return resp.data;
};
