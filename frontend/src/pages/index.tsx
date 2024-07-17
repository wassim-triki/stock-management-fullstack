import UserCard, { IUser } from "@/components/user-card";
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
  const [users, setUsers] = useState<IUser[] | []>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/users");
        const data = (await res.json()) as IUser[];
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchUsers();
  }, []);
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
