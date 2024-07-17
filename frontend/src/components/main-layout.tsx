import { ReactNode } from "react";
import Head from "next/head";
import Header from "./header";
import { GetServerSideProps } from "next";

type MainLayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

const MainLayout = ({
  children,
  description,
  title = "Default Title",
}: MainLayoutProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>{children}</main>
      {/* <footer>
        <p>Footer content</p>
      </footer> */}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data here. For this example, we are hardcoding the values.
  const title = "Home";
  const description =
    "This is an example of a good SEO setup with Next.js and Express";

  return {
    props: {
      title,
      description,
    },
  };
};

export default MainLayout;
