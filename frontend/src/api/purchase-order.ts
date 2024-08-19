// api/purchaseOrder.ts
"use server";
import {
  ApiSearchFilter,
  ApiSuccessResponse,
  ApiSuccessResponseList,
  PurchaseOrder,
  QueryParams,
} from "@/lib/types";
import fetchHelper from "@/lib/fetchInstance";
import { buildQueryParamsString } from "@/lib/utils";
import config from "@/lib/config";
import { PurchaseOrderFormValues } from "@/components/forms/purchase-order-form";
import { revalidateTag } from "next/cache";
import fetchPDFHelper from "@/lib/fetchPDFHelper";

export const getPurchaseOrders = async (
  queryParams?: QueryParams,
): Promise<PurchaseOrder[]> => {
  "use server";

  const queryParamsStr = await buildQueryParamsString(queryParams);

  const response: ApiSuccessResponseList<PurchaseOrder> = await fetchHelper(
    `/api/purchase-orders?${queryParamsStr.toString()}`,
    {
      next: { tags: ["purchase-orders"] },
    },
  );
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

export const createPurchaseOrder = async (
  data: PurchaseOrderFormValues,
): Promise<ApiSuccessResponse<PurchaseOrder>> => {
  revalidateTag("purchase-orders");
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
  data: Partial<PurchaseOrderFormValues>;
}): Promise<ApiSuccessResponse<PurchaseOrder>> => {
  revalidateTag("purchase-orders");
  return await fetchHelper(`/api/purchase-orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deletePurchaseOrder = async (
  purchaseOrderId: string,
): Promise<ApiSuccessResponse<PurchaseOrder>> => {
  revalidateTag("purchase-orders");
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

export const cancelPurchaseOrder = async (
  id: string,
): Promise<ApiSuccessResponse<PurchaseOrder>> => {
  revalidateTag("purchase-orders");
  return await fetchHelper(`/api/purchase-orders/${id}/cancel`, {
    method: "POST",
  });
};

// Send purchase order action
export const sendPurchaseOrder = async (
  id: string,
): Promise<ApiSuccessResponse> => {
  revalidateTag("purchase-orders");
  return await fetchHelper(`/api/purchase-orders/${id}/send`, {
    method: "POST",
  });
};

// Fetch PDF for purchase order preview
export const fetchPurchaseOrderPdf = async (id: string): Promise<Blob> => {
  revalidateTag("purchase-orders");
  const response = await fetchPDFHelper(`/api/purchase-orders/${id}/print`);
  return response;
};

export const addToStock = async (id: string): Promise<ApiSuccessResponse> => {
  revalidateTag("purchase-orders");
  return await fetchHelper(`/api/purchase-orders/add-to-stock`, {
    method: "POST",
    body: JSON.stringify({ id }),
  });
};
