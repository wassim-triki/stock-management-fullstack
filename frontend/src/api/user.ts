import { axiosInstance } from "@/lib/axios";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  ApiSuccessResponseList,
  User,
} from "@/lib/types";
import { AxiosResponse } from "axios";

export async function getUsers(): Promise<User[]> {
  return axiosInstance
    .get(`/api/users`)
    .then(
      (response: AxiosResponse<ApiSuccessResponseList<User>>) =>
        response.data.data.items,
    );
}
export async function deleteUser(
  userId: string,
): Promise<ApiSuccessResponse<User>> {
  return axiosInstance
    .delete(`/api/users/${userId}`)
    .then((response: AxiosResponse<ApiSuccessResponse<User>>) => response.data);
}
