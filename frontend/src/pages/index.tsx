import Head from "next/head";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
import { Inter as FontSans } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import MainLayout from "@/components/main-layout";

export default function Home() {
  return <h1>Home</h1>;
}

Home.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <MainLayout title="Home">
      {/* <NestedLayout>{page}</NestedLayout> */}
      {page}
    </MainLayout>
  );
};
