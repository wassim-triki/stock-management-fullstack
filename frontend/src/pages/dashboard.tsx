import MainLayout from "@/components/main-layout";
import { withAuth } from "@/lib/auth";
import { GetServerSideProps } from "next";
import React from "react";

interface DashboardProps {
  // Define the type for the props object
  // Add any additional properties you need
}

function Dashboard(props: DashboardProps) {
  return (
    <MainLayout>
      <div className="absolute left-0 top-0 flex h-screen w-full items-center justify-center text-6xl font-bold">
        Dashboard
      </div>
      <p>{JSON.stringify(props)}</p>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async (ctx) => {
  // Fetch user-specific data if necessary

  return {
    props: {},
  };
});

export default Dashboard;
