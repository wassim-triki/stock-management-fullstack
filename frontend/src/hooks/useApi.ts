import { useState } from "react";
import axios from "@/lib/axiosInstance";
import { IErrorResponse, ISuccessResponse } from "@/api/auth";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<IErrorResponse | null>(null);

  const apiRequest = async <T>(
    request: () => Promise<T>,
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await request();
      return response;
    } catch (err) {
      const errorResponse = (err as { response: { data: IErrorResponse } })
        .response.data;
      setError(errorResponse);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, apiRequest };
}
