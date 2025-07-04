import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// import { useInitStore } from "../libraries/services";

interface LayoutProps {
  children: React.ReactNode;
}

// In your page or parent component
import dynamic from "next/dynamic";
import { commonStyles } from "../styles/commonStyles";

const DigitInitializer = dynamic(() => import("./DigitInitializer"), {
  ssr: false,
});

const Layout: React.FC<LayoutProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [digitReady, setDigitReady] = useState(false);
  const [stateCode, setStateCode] = useState("pb");

  const enabledModules = ["DRISTI", "Submissions", "orders", "Hearings", "Cases", "home"];

  // Wait for window.Digit to be available
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && window?.Digit?.Hooks?.useInitStore && window?.globalConfigs) {
        const code = window.globalConfigs.getConfig("STATE_LEVEL_TENANT_ID");
        setStateCode(code || "pb");
        setDigitReady(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Show loading until Digit is ready
  if (!digitReady || !stateCode) {
    return (
      <div className={commonStyles.loading.container}>
        <div className={commonStyles.loading.spinner}></div>
        <div className="mt-4 text-[#0F766E] text-sm font-medium">Loading, please wait...</div>
      </div>
    );
  }
  return (
    <DigitInitializer stateCode={stateCode} enabledModules={enabledModules}>
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
    </DigitInitializer>
  );
};
export default Layout;
