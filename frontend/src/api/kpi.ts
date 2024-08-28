"use server";
import { ApiSuccessResponse } from "@/lib/types";
import fetchHelper from "@/lib/fetchInstance";
import { Transaction } from "@/components/admin-panel/transactions";

export type KPI = {
  users: {
    total: number;
    new: number;
    growth: string;
  };
  clients: {
    total: number;
    new: number;
    growth: string;
  };
  suppliers: {
    total: number;
    new: number;
    growth: string;
  };
  products: {
    total: number;
    unique: number;
    outOfStock: number; // New field for out of stock products
    lowStock: number;
  };
  revenue: {
    total: number;
    growth: string;
  };
  transactions: Transaction[];
};

export const getKPI = async (): Promise<KPI> => {
  const response: ApiSuccessResponse<KPI> = await fetchHelper(`/api/kpi`, {
    next: { tags: ["kpi"] },
  });
  return response.data;
};
