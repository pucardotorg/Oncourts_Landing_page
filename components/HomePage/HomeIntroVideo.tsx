import React, { useState } from "react";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { useRouter } from "next/router";
import { svgIcons } from "../../data/svgIcons";
import { APP_URLS } from "../../lib/config";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Tooltip from "../common/Tooltip";

const HomeIntroVideo = () => {
  const { t } = useSafeTranslation();
  const router = useRouter();
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showLoginTooltip, setShowLoginTooltip] = useState(false);
  const [showSearchTooltip, setShowSearchTooltip] = useState(false);
  const videoId = "-JoWnkE-uTs";

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
    <div className="relative bg-white py-12 px-10 sm:px-6 lg:px-8 md:py-16">
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
      <div className="px-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="font-libre not-italic font-normal text-[64px] leading-[78px] text-[#3A3A3A]">
              {t("TAKING_COURT_TO_PEOPLE")}
            </h1>
            <p className="font-roboto not-italic font-normal text-[#334155] text-[28px] leading-[36px] tracking-normal">
              {t("COURT_DESCRIPTION")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative login-dropdown">
                <button
                  className="box-border flex flex-row items-center justify-center px-4 py-8 gap-4 w-[241px] h-[69px] bg-[#0F766E] border border-[#0F766E] rounded-[12px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLoginDropdownOpen(!loginDropdownOpen);
                  }}
                  onMouseEnter={() => setShowLoginTooltip(true)}
                  onMouseLeave={() => setShowLoginTooltip(false)}
                >
                  <span className="w-[68px] h-[32px] font-roboto font-medium text-[28px] leading-[32px] tracking-[-0.56px] text-white">
                    {t("LOGIN")}
                  </span>
                  <svgIcons.downArrowIcon fill="#fff" />
                </button>
                {showLoginTooltip && !loginDropdownOpen && (
                  <Tooltip
                    text={t(
                      "Log in to file cases, submit applications and more"
                    )}
                  />
                )}
                {loginDropdownOpen && (
                  <div
                    className="w-max absolute left-0 top-full mt-1bg-white rounded-md shadow-lg overflow-hidden z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="px-4 py-3 text-left text-[#3A3A3A] hover:bg-gray-50 transition-colors flex justify-center items-center gap-2 text-sm hover:text-[#0F766E]"
                      onClick={() => {
                        window.open(APP_URLS.CITIZEN_DRISTI, "_blank");
                        setLoginDropdownOpen(false);
                      }}
                    >
                      <span className="font-roboto font-medium text-[24px] leading-[28px] tracking-[-0.24px] text-[#3A3A3A] hover:text-[#0F766E]">
                        {t("ADVOCATE_LITIGANT_LOGIN")}
                      </span>
                    </button>
                    <button
                      className="px-4 py-3 text-left text-[#3A3A3A] hover:bg-gray-50 transition-colors flex justify-center items-center gap-2 text-sm hover:text-[#0F766E]"
                      onClick={() => {
                        window.open(APP_URLS.EMPLOYEE_USER, "_blank");
                        setLoginDropdownOpen(false);
                      }}
                    >
                      <span className="font-roboto font-medium text-[24px] leading-[28px] tracking-[-0.24px] text-[#3A3A3A] hover:text-[#0F766E]">
                        {t("JUDGE_STAFF_LOGIN")}
                      </span>
                    </button>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  className="box-border flex flex-col items-center justify-center px-4 py-8 gap-6 w-[241px] h-[69px] bg-white border border-[#0F766E] rounded-[12px]"
                  onClick={() => router.push("/search")}
                  onMouseEnter={() => setShowSearchTooltip(true)}
                  onMouseLeave={() => setShowSearchTooltip(false)}
                >
                  <span className="font-roboto font-medium text-[28px] leading-[32px] tracking-[-0.56px] text-[#0F766E]">
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
          <div className="w-[740px] h-[444px]">
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
