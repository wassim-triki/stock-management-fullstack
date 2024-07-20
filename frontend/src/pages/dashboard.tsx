import MainLayout from "@/components/main-layout";
import React from "react";

function dashboard() {
  return (
    <MainLayout>
      <div className="absolute left-0 top-0 flex h-screen w-full items-center justify-center text-6xl font-bold">
        Dashboard
      </div>
    </MainLayout>
  );
}

export default dashboard;
