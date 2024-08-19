import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/theme-provider";
import { GeistSans } from "geist/font/sans";
import "../styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "@/providers/react-query-provider";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ReactQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}
            <Toaster />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
