import React, { useEffect, useState } from "react";
import Head from "next/head";
import Footer from "./Footer";
import { Raleway } from "next/font/google";
import { Roboto } from "next/font/google";
import { Libre_Baskerville } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});

// import { useInitStore } from "../libraries/services";

interface LayoutProps {
  children: React.ReactNode;
}

// In your page or parent component
import dynamic from "next/dynamic";
import { commonStyles } from "../styles/commonStyles";
import HeaderV2 from "./HeaderV2";

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

  const enabledModules = [
    "DRISTI",
    "Submissions",
    "orders",
    "Hearings",
    "Cases",
    "home",
  ];

  // Wait for window.Digit to be available
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        typeof window !== "undefined" &&
        window?.Digit?.Hooks?.useInitStore &&
        window?.globalConfigs
      ) {
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
        <div className="mt-4 text-[#0F766E] text-sm font-medium">
          Loading, please wait...
        </div>
      </div>
    );
  }
  return (
    <DigitInitializer stateCode={stateCode} enabledModules={enabledModules}>
      <div
        className={`${roboto.className} ${raleway.className} ${libreBaskerville.className}`}
      >
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
          <HeaderV2 />
          <main className="flex-grow md:pt-[73px]">{children}</main>
          <Footer />
        </div>
      </div>
    </DigitInitializer>
  );
};
export default Layout;
