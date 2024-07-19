import type { ButtonHTMLAttributes } from "react";
import { Button } from "./button";
import { LoadingSpinner } from "./loading-spinner";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean;
}

export default function SubmitButton({
  children,
  loading = false,
  ...props
}: SubmitButtonProps) {
  return (
    <Button type="submit" aria-busy={loading} className="w-full">
      {/* {loading ? <LoadingSpinner /> : children} */}
      {!loading && children}
    </Button>
  );
}
