import { ButtonHTMLAttributes } from "react";
import { Button } from "./button";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean;
  children: React.ReactNode;
}

export default function SubmitButton({
  children,
  loading = false,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={loading || disabled}
      aria-busy={loading}
      className="w-full"
    >
      {/* {loading ? <LoadingSpinner /> : children} */}
      {!loading && children}
    </Button>
  );
}
