import axios from "@/lib/axiosInstance";
import { IRegisterData } from "@/context/multistep-registration-form-context";
import { ILoginForm } from "@/components/login";

export interface ISuccessResponse {
  success: boolean;
  payload: {
    message: string;
    data: object;
  };
}

export interface IErrorResponse {
  success: boolean;
  statusCode: number;
  error: { message: string; details?: object };
}

export async function checkEmailAvailability(
  { email, password, confirmPassword }: Partial<IRegisterData>,
  apiRequest: <T>(request: () => Promise<T>) => Promise<T | null>,
): Promise<ISuccessResponse | IErrorResponse | null> {
  return apiRequest<ISuccessResponse | IErrorResponse>(async () => {
    const response = await axios.post("/api/auth/check-email", {
      email,
      password,
      confirmPassword,
    });
    const data: unknown = response.data;
    const resp: ISuccessResponse = data as ISuccessResponse;
    return resp;
  });
}

export async function stepTwoHandler(
  { firstName, lastName }: Partial<IRegisterData>,
  apiRequest: <T>(request: () => Promise<T>) => Promise<T | null>,
): Promise<ISuccessResponse | IErrorResponse | null> {
  return apiRequest<ISuccessResponse | IErrorResponse>(async () => {
    const response = await axios.post("/api/auth/step-two", {
      firstName,
      lastName,
    });
    const data: unknown = response.data;
    const resp: ISuccessResponse = data as ISuccessResponse;
    return resp;
  });
}

export async function signupHandler(
  formData: IRegisterData,
  apiRequest: <T>(request: () => Promise<T>) => Promise<T | null>,
): Promise<ISuccessResponse | IErrorResponse | null> {
  return apiRequest<ISuccessResponse | IErrorResponse>(async () => {
    const response = await axios.post("/api/auth/signup", formData);
    const data: unknown = response.data;
    const resp: ISuccessResponse = data as ISuccessResponse;
    return resp;
  });
}

export async function loginHandler(
  formData: ILoginForm,
  apiRequest: <T>(request: () => Promise<T>) => Promise<T | null>,
): Promise<ISuccessResponse | IErrorResponse | null> {
  return apiRequest<ISuccessResponse | IErrorResponse>(async () => {
    const response = await axios.post("/api/auth/login", formData);
    const data: unknown = response.data;
    const resp: ISuccessResponse = data as ISuccessResponse;
    return resp;
  });
}
