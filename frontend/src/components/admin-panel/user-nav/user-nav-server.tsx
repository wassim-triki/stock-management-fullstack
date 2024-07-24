// UserNavServer.tsx
import React from "react";
import { getAuthUser } from "@/api/auth";
import { UserNavClient } from "./user-nav-client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants";

export default async function UserNavServer() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.auth],
    queryFn: getAuthUser,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserNavClient />;
    </HydrationBoundary>
  );
}
