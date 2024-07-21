// UserNavServer.tsx
import React from "react";
import { getAuthUser } from "@/api/auth";
import { UserNavClient } from "./user-nav-client";

export default async function UserNavServer() {
  const user = await getAuthUser();

  return <UserNavClient user={user} />;
}
