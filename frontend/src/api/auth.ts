import { object } from "zod";
import axios from "@/lib/axiosInstance";
import { ifError } from "assert";
import { IRegisterData } from "@/context/multistep-registration-form-context";
import { AxiosError } from "axios";

interface ISuccessResponse {
  success: boolean;
  payload: {
    message: string;
    data?: object;
  };
}

export interface IErrorResponse {
  success: boolean;
  statusCode: number;
  error: { message: string; details?: object };
}

export async function checkEmailAvailability({
  email,
  password,
  confirmPassword,
}: Partial<IRegisterData>): Promise<ISuccessResponse | IErrorResponse> {
  try {
    const response = await axios.post("/api/auth/check-email", {
      email,
      password,
      confirmPassword,
    });
    const data: unknown = response.data;
    const resp: ISuccessResponse = data as ISuccessResponse;
    return resp;
  } catch (error: unknown) {
    return (error as { response: { data: IErrorResponse } }).response.data;
  }
}
