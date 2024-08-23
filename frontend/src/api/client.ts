"use server";
import fetchHelper from "@/lib/fetchInstance";
import {
  ApiSuccessResponse,
  ApiSuccessResponseList,
  QueryParams,
  Client,
} from "@/lib/types";
import { buildQueryParamsString } from "@/lib/utils";
import { revalidateTag } from "next/cache";

// Fetch all clients with optional query parameters (pagination, filters, etc.)
export const getClients = async (
  queryParams?: QueryParams,
): Promise<Client[]> => {
  const queryParamsStr = await buildQueryParamsString(queryParams);

  const response: ApiSuccessResponseList<Client> = await fetchHelper(
    `/api/clients?${queryParamsStr}`,
    {
      next: { tags: ["clients"] },
    },
  );
  return response.data.items;
};

// Fetch a single client by ID
export const getClientById = async (id: string): Promise<Client> => {
  const response: ApiSuccessResponse<Client> = await fetchHelper(
    `/api/clients/${id}`,
  );
  return response.data;
};

// Create a new client
export const createClient = async (
  data: Partial<Client>,
): Promise<ApiSuccessResponse<Client>> => {
  revalidateTag("clients");
  return await fetchHelper("/api/clients", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update a client by ID
export const updateClient = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<Client>;
}): Promise<ApiSuccessResponse<Client>> => {
  revalidateTag("clients");
  return await fetchHelper(`/api/clients/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete a client by ID
export const deleteClient = async (
  id: string,
): Promise<ApiSuccessResponse<Client>> => {
  revalidateTag("clients");
  return await fetchHelper(`/api/clients/${id}`, {
    method: "DELETE",
  });
};

// Fetch total number of clients
export const getTotalClients = async (): Promise<number> => {
  const response: ApiSuccessResponseList<number> =
    await fetchHelper(`/api/clients/total`);
  return response.data.total;
};
