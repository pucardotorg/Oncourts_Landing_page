import React from "react";
import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>24x7 OnCourts</title>
        <meta
          name="description"
          content="24x7 OnCourts"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/images/logo.png" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
};
export default Layout;
