import { AlertCircle } from "lucide-react";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "./alert";

//defien props
interface IAlertDestructiveProps {
  descirption?: string;
  error: string;
}

export function AlertDestructive({
  descirption,
  error,
}: IAlertDestructiveProps) {
  return (
    <Alert className="text-sm" variant="destructive">
      <div className="flex items-center gap-2">
        <AlertCircle className="mb-[2px] h-4 w-4" />
        <AlertTitle>{error}</AlertTitle>
      </div>
      {descirption && <AlertDescription>{descirption}</AlertDescription>}
    </Alert>
  );
}
