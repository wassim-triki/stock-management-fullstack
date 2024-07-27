// api/purchaseOrder.ts
"use server";
import {
  ApiSearchFilter,
  ApiSuccessResponse,
  ApiSuccessResponseList,
  PurchaseOrder,
} from "@/lib/types";
import fetchHelper from "@/lib/fetchInstance";
import { buildQueryParams } from "@/lib/utils";

export const getPurchaseOrders = async (
  filter: ApiSearchFilter,
): Promise<PurchaseOrder[]> => {
  "use server";

  const queryParams = await buildQueryParams(filter);

  const response: ApiSuccessResponseList<PurchaseOrder> = await fetchHelper(
    `/api/purchase-orders?${queryParams.toString()}`,
  );
  console.log(response.data.items);
  return response.data.items;
};

export const getPurchaseOrderById = async (
  id: string,
): Promise<PurchaseOrder> => {
  const response: ApiSuccessResponse<PurchaseOrder> = await fetchHelper(
    `/api/purchase-orders/${id}`,
  );
  return response.data;
};

export const createPurchaseOrder = async (data: {
  supplier: string;
  items: { product: string; quantity: number; price: number }[];
}): Promise<ApiSuccessResponse<PurchaseOrder>> => {
  return await fetchHelper("/api/purchase-orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updatePurchaseOrder = async ({
  id,
  data,
}: {
  id: string;
  data: {
    supplier: string;
    items: { product: string; quantity: number; price: number }[];
  };
}): Promise<ApiSuccessResponse<PurchaseOrder>> => {
  return await fetchHelper(`/api/purchase-orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deletePurchaseOrder = async (
  purchaseOrderId: string,
): Promise<ApiSuccessResponse<PurchaseOrder>> => {
  return await fetchHelper(`/api/purchase-orders/${purchaseOrderId}`, {
    method: "DELETE",
  });
};

export const getTotalPurchaseOrders = async (): Promise<number> => {
  const response: ApiSuccessResponse<{ total: number }> = await fetchHelper(
    "/api/purchase-orders/total",
  );
  return response.data.total;
};
