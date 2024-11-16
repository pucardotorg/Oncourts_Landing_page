import React from "react";
import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className={raleway.className}>
      <Head>
        <title>24x7 OnCourts</title>
        <meta
          name="description"
          content="24x7 OnCourts - Your comprehensive platform for court case tracking and legal updates. Access real-time court information and announcements."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <link rel="icon" href="/images/logo.png" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </div>
  );
};
export default Layout;
