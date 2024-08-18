import Spinner from "@/components/spinner";
import React from "react";

const LoadingPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner size="64px" width="1" />
    </div>
  );
};

export default LoadingPage;
