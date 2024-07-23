// app/providers.jsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

function queryErrorHandler(error: unknown): void {
  const title =
    error instanceof Error
      ? `Something went wrong: ${error.message}`
      : "error connecting to server";

  alert("queryErrorHandler");
}

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            // staleTime: 4 * 1000,
            // refetchInterval: 4 * 1000,
          },
          mutations: {
            onError: queryErrorHandler,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
