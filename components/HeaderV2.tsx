import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSafeTranslation } from "../hooks/useSafeTranslation";

import NavItem from "./NavItem";
import DropdownMenu from "./DropdownMenu";

const MENU_ITEMS = {
  ABOUT: [
    { label: "ABOUT_ON_COURTS", href: "/about" }, // About ON Courts
    { label: "PEOPLE", href: "/about/people" }, // People
  ],
  SERVICES: [
    {
      label: "LOGIN",
      subItems: [
        { label: "ADVOCATE_LITIGANT_LOGIN", href: "/login/advocate" },
        { label: "JUDGE_STAFF_LOGIN", href: "/login/judge" },
      ],
    },
    { label: "CASE_SEARCH", href: "/search" }, // Case Search
    { label: "DISPLAY_BOARD", href: "/display-board" }, // Display Board
  ],
  SUPPORT: [
    { label: "HELP", href: "/help" },
    { label: "CONTACT", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
};

const HeaderV2 = () => {
  const router = useRouter();
  const { t } = useSafeTranslation();
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [supportDropdownOpen, setSupportDropdownOpen] = useState(false);

  const closeDropdownsRef = useRef(() => {});

  // Always point to the latest state update logic
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

  return (
    <header className="w-full shadow-sm">
      <nav className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between px-6 h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt={t("ONCOURTS_LOGO")} // "OnCourts Logo"
              width={123}
              height={73}
              className="h-12 w-auto"
            />
          </Link>

          {/* Navigation Items */}
          <div
            className="hidden md:flex items-center space-x-1"
            onClick={handleDropdownClick}
          >
            <NavItem
              href="/"
              label="HOME" // "Home"
              isActive={router.pathname === "/"}
              t={t}
            />

            <div className="relative">
              <NavItem
                href="#"
                label="ABOUT_US" // "About Us"
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
              />
              {aboutDropdownOpen && (
                <DropdownMenu
                  items={MENU_ITEMS.ABOUT}
                  isOpen={aboutDropdownOpen}
                  t={t}
                />
              )}
            </div>

            <div className="relative">
              <NavItem
                href="#"
                label="SERVICES" // "Services"
                isActive={
                  servicesDropdownOpen ||
                  router.pathname.startsWith("/services")
                }
                hasDropdown
                onClick={() => {
                  setServicesDropdownOpen(!servicesDropdownOpen);
                  setAboutDropdownOpen(false);
                  setSupportDropdownOpen(false);
                }}
                t={t}
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
              href="/dashboard"
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
              />
              {supportDropdownOpen && (
                <DropdownMenu
                  items={MENU_ITEMS.SUPPORT}
                  isOpen={supportDropdownOpen}
                  t={t}
                />
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            onClick={() => {
              /* TODO: Add mobile menu handler */
            }}
          >
            <span className="sr-only">{t("OPEN_MENU")}</span>{" "}
            {/* "Open menu" */}
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default HeaderV2;
