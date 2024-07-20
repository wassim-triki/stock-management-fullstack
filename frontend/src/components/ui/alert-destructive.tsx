import { AlertCircle } from "lucide-react";
import React from 'react';
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
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{error}</AlertTitle>
      {descirption && (
        <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription>
      )}
    </Alert>
  );
}