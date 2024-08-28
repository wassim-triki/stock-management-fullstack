"use server";
import { ApiSuccessResponse, Currency } from "@/lib/types";
import fetchHelper from "@/lib/fetchInstance";

export type CurrenciesMap = {
  [key: string]: Currency;
};

export const getCurrencies = async (): Promise<CurrenciesMap> => {
  const response: ApiSuccessResponse<{ currencies: CurrenciesMap }> =
    await fetchHelper(`/api/currencies`, {
      next: { tags: ["currencies"] },
    });
  return response.data.currencies;
};
