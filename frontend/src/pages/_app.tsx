import { GeistSans } from "geist/font/sans";
import { AppProps, type AppType } from "next/app";

import "@/styles/globals.css";
import { NextPage } from "next";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <div className={GeistSans.className}>
      {getLayout(<Component {...pageProps} />)}
    </div>
  );
}

export default MyApp;
