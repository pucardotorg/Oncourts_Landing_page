import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSafeTranslation } from "../hooks/useSafeTranslation";
import NavItem from "./NavItem";
import DropdownMenu from "./DropdownMenu";
import { useMediaQuery } from "@mui/material";

import MobileHeader from "./MobileHeader";
import { APP_URLS } from "../lib/config";

export const MENU_ITEMS = {
  ABOUT_US: [
    { label: "ABOUT_ON_COURTS", href: "/about" },
    { label: "PEOPLE", href: "/about/people" },
  ],
  SERVICES: [
    {
      label: "LOGIN",
      subItems: [
        {
          label: "ADVOCATE_LITIGANT_LOGIN",
          href: `${APP_URLS.CITIZEN_DRISTI}`,
          target: "_blank",
        },
        {
          label: "JUDGE_STAFF_LOGIN",
          href: `${APP_URLS.EMPLOYEE_USER}`,
          target: "_blank",
        },
      ],
    },
    { label: "CASE_SEARCH", href: "/search" },
    { label: "DISPLAY_CAUSELIST_HEADING", href: "/display-board" },
  ],
  SUPPORT: [
    { label: "HELP_RESOURCES", href: "/help-resources" },
    { label: "VIDEO_TUTORIALS", href: "/video-tutorials" },
  ],
};

function HeaderV2(): JSX.Element {
  const router = useRouter();
  const { t } = useSafeTranslation();
  const isMobile = useMediaQuery("(max-width:640px)");
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [supportDropdownOpen, setSupportDropdownOpen] = useState(false);
  const closeDropdownsRef = useRef(() => {});

  useEffect(() => {
    closeDropdownsRef.current = () => {
      setAboutDropdownOpen(false);
      setServicesDropdownOpen(false);
      setSupportDropdownOpen(false);
    };
  });

  useEffect(() => {
    const handleClickOutside = () => {
      setAboutDropdownOpen(false);
      setServicesDropdownOpen(false);
      setSupportDropdownOpen(false);
    };

    const handleRouteChange = () => {
      setAboutDropdownOpen(false);
      setServicesDropdownOpen(false);
      setSupportDropdownOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events]);

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (isMobile) {
    return <MobileHeader />;
  }

  return (
    <header className="w-full h-[73px] border-b border-[#94A3B8] px-[30px] py-2 flex justify-between items-center fixed top-0 left-0 right-0 bg-white z-50">
      <Link href="/" className="flex-shrink-0">
        <Image
          src="/images/logo.png"
          alt={t("ONCOURTS_LOGO")}
          width={123}
          height={73}
          className="h-12 w-auto"
        />
      </Link>
      <nav className="flex">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center space-x-1"
            onClick={handleDropdownClick}
          >
            <NavItem
              href="/"
              label="HOME"
              isActive={router.pathname === "/"}
              t={t}
            />

            <div className="relative">
              <NavItem
                href="#"
                label="ABOUT_US"
                isActive={
                  aboutDropdownOpen || router.pathname.startsWith("/about")
                }
                hasDropdown
                onClick={() => {
                  setAboutDropdownOpen(!aboutDropdownOpen);
                  setServicesDropdownOpen(false);
                  setSupportDropdownOpen(false);
                }}
                t={t}
                isDropdownOpen={aboutDropdownOpen}
              />
              {aboutDropdownOpen && (
                <DropdownMenu
                  items={MENU_ITEMS.ABOUT_US}
                  isOpen={aboutDropdownOpen}
                  t={t}
                />
              )}
            </div>

            <div className="relative">
              <NavItem
                href="#"
                label="SERVICES"
                isActive={
                  servicesDropdownOpen ||
                  router.pathname.includes("/display-board") ||
                  router.pathname.includes("/login") ||
                  router.pathname.includes("/search")
                }
                hasDropdown
                onClick={() => {
                  setServicesDropdownOpen(!servicesDropdownOpen);
                  setAboutDropdownOpen(false);
                  setSupportDropdownOpen(false);
                }}
                t={t}
                isDropdownOpen={servicesDropdownOpen}
              />
              {servicesDropdownOpen && (
                <DropdownMenu
                  items={MENU_ITEMS.SERVICES}
                  isOpen={servicesDropdownOpen}
                  t={t}
                />
              )}
            </div>

            <NavItem
              href="/notices"
              label="NOTICES" // "Notices"
              isActive={router.pathname === "/notices"}
              t={t}
            />

            <NavItem
              href="/"
              label="DASHBOARD" // "Dashboard"
              isActive={router.pathname === "/dashboard"}
              t={t}
            />

            <div className="relative">
              <NavItem
                href="#"
                label="SUPPORT" // "Support"
                isActive={
                  supportDropdownOpen || router.pathname.startsWith("/support")
                }
                hasDropdown
                onClick={() => {
                  setSupportDropdownOpen(!supportDropdownOpen);
                  setAboutDropdownOpen(false);
                  setServicesDropdownOpen(false);
                }}
                t={t}
                isDropdownOpen={supportDropdownOpen}
              />
              {supportDropdownOpen && (
                <DropdownMenu
                  items={MENU_ITEMS.SUPPORT}
                  isOpen={supportDropdownOpen}
                  t={t}
                  isLast={true}
                />
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default HeaderV2;
