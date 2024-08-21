import React from "react";
import { Badge } from "./badge";

type ActiveBadgeProps = {
  active: boolean;
};
function ActiveBadge({ active }: ActiveBadgeProps) {
  const status = active ? "Active" : "Inactive";
  const badgeVariant = active ? "success" : "secondary";
  return (
    <div className="flex space-x-2">
      <span className="max-w-[100px] truncate font-medium">
        <Badge variant={badgeVariant}>{status}</Badge>
      </span>
    </div>
  );
}

export default ActiveBadge;
