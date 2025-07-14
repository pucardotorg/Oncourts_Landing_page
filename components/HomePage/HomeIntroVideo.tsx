import React, { useState } from "react";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { useRouter } from "next/router";
import { svgIcons } from "../../data/svgIcons";
import { APP_URLS } from "../../lib/config";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Tooltip from "../common/Tooltip";
import { useMediaQuery } from "@mui/material";

const HomeIntroVideo = () => {
  const { t } = useSafeTranslation();
  const router = useRouter();
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showCitizenTooltip, setShowCitizenTooltip] = useState(false);
  const [showEmployeeTooltip, setShowEmployeeTooltip] = useState(false);
  const [showSearchTooltip, setShowSearchTooltip] = useState(false);
  const videoId = "-JoWnkE-uTs";
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".login-dropdown")) {
        setLoginDropdownOpen(false);
      }
    };

    if (loginDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [loginDropdownOpen]);

  return (
    <div
      className={`relative bg-white px-2 sm:px-6 lg:px-8 ${isMobile ? "pb-0 pt-4" : "pb-2 pt-12"}`}
    >
      {showFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
            title="ON Courts Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      <div className={` ${isMobile ? "px-2" : "px-2"}`}>
        <div
          className={`flex items-center justify-center mb-8 ${isMobile ? "flex-col gap-4" : "flex-row gap-32"}`}
        >
          {/* Left Content */}
          <div
            className={`space-y-6 ${isMobile ? "max-w-[100%] px-8" : "max-w-[50%]"}`}
          >
            <h1
              className={`font-libre not-italic font-normal  text-[#3A3A3A] ${isMobile ? "text-center text-[32px] leading-[42px] border-b border-[#CBD5E1] pb-2" : "text-[64px] leading-[78px]"}`}
            >
              {t("TAKING_COURT_TO_PEOPLE")}
            </h1>
            <p
              className={`font-roboto not-italic font-normal text-[#334155]  tracking-normal ${isMobile ? "text-center text-[17px] leading-[22px]" : "text-[28px] leading-[36px]"}`}
            >
              {t("COURT_DESCRIPTION")}
            </p>
            <div className="flex flex-row gap-4">
              <div className="relative login-dropdown">
                <button
                  className={`cursor-default box-border flex flex-row items-center justify-center gap-4  bg-[#0F766E] border border-[#0F766E] rounded-[12px] ${isMobile ? "h-[40px] w-[135px] px-[12px] py-2" : "h-[69px] w-[241px] px-4 py-8"}`}
                >
                  <span
                    className={
                      isMobile
                        ? "text-center font-roboto font-medium text-[14px] leading-[20px] text-white"
                        : "h-[32px] font-roboto font-medium text-[28px] leading-[32px] tracking-[-0.56px] text-white"
                    }
                  >
                    {t("LOGIN")}
                  </span>
                  <span
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLoginDropdownOpen(!loginDropdownOpen);
                    }}
                  >
                    <svgIcons.DownArrowIcon fill="#fff" />
                  </span>
                </button>

                {loginDropdownOpen && (
                  <div
                    className="w-max absolute left-0 top-full mt-1 bg-white rounded-md shadow-lg overflow-hidden z-[9999] min-w-[135px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="px-4 py-3 text-left text-[#3A3A3A] hover:bg-gray-50 transition-colors flex justify-center items-center gap-2 text-sm hover:text-[#0F766E]"
                      onClick={() => {
                        window.open(APP_URLS.CITIZEN_DRISTI, "_blank");
                        setLoginDropdownOpen(false);
                      }}
                      onMouseEnter={() => setShowCitizenTooltip(true)}
                      onMouseLeave={() => setShowCitizenTooltip(false)}
                    >
                      <span
                        className={
                          isMobile
                            ? "text-center font-roboto font-medium text-[14px] leading-[20px] text-[#0F766E]"
                            : "font-roboto font-medium text-[24px] leading-[28px] tracking-[-0.24px] text-[#3A3A3A] hover:text-[#0F766E]"
                        }
                      >
                        {" "}
                        {t("ADVOCATE_LITIGANT_LOGIN")}
                      </span>
                    </button>
                    {showCitizenTooltip && (
                      <Tooltip
                        text={t(
                          "Log in to file cases, submit applications and more"
                        )}
                      />
                    )}
                    <button
                      className="px-4 py-3 text-left text-[#3A3A3A] hover:bg-gray-50 transition-colors flex justify-center items-center gap-2 text-sm hover:text-[#0F766E]"
                      onClick={() => {
                        window.open(APP_URLS.EMPLOYEE_USER, "_blank");
                        setLoginDropdownOpen(false);
                      }}
                      onMouseEnter={() => setShowEmployeeTooltip(true)}
                      onMouseLeave={() => setShowEmployeeTooltip(false)}
                    >
                      <span
                        className={
                          isMobile
                            ? "text-center font-roboto font-medium text-[14px] leading-[20px] text-[#0F766E]"
                            : "font-roboto font-medium text-[24px] leading-[28px] tracking-[-0.24px] text-[#3A3A3A] hover:text-[#0F766E]"
                        }
                      >
                        {t("JUDGE_STAFF_LOGIN")}
                      </span>
                    </button>
                    {showEmployeeTooltip && (
                      <Tooltip
                        text={t(
                          "Log in to manage cases, issue orders, and support courtroom proceedings"
                        )}
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  className={`box-border text-[white] flex flex-row items-center justify-center gap-4  bg-[white] border border-[#0F766E] rounded-[12px] ${isMobile ? "h-[40px] w-[135px] px-[12px] py-2" : "h-[69px] w-[241px] px-4 py-8"}`}
                  onClick={() => router.push("/search")}
                  onMouseEnter={() => setShowSearchTooltip(true)}
                  onMouseLeave={() => setShowSearchTooltip(false)}
                >
                  <span
                    className={
                      isMobile
                        ? "text-center font-roboto font-medium text-[14px] leading-[20px] text-[#0F766E]"
                        : "h-[32px] font-roboto font-medium text-[28px] leading-[32px] tracking-[-0.56px] text-[#0F766E]"
                    }
                  >
                    {" "}
                    {t("CASE_SEARCH")}
                  </span>
                </button>
                {showSearchTooltip && (
                  <Tooltip
                    text={t(
                      "Log in to manage cases, issue orders, and support courtroom proceedings"
                    )}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Video Section */}
          <div
            className={` ${isMobile ? "w-full h-[90%]" : "w-[90%] h-[50%]"}`}
          >
            <div className="relative rounded-md overflow-hidden shadow-lg aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                title="ON Courts Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <button
                onClick={() => setShowFullscreen(true)}
                className="absolute bottom-3 right-3 flex items-center justify-center rounded-full hover:opacity-90 transition-opacity"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  border: "2px solid #4B5563",
                }}
                aria-label="View fullscreen"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={20}
                  height={20}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 3H5a2 2 0 0 0-2 2v4" />
                  <path d="M15 3h4a2 2 0 0 1 2 2v4" />
                  <path d="M9 21H5a2 2 0 0 1-2-2v-4" />
                  <path d="M15 21h4a2 2 0 0 0 2-2v-4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeIntroVideo;
