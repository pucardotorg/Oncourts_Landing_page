import React, { useState } from "react";
import Image from "next/image";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { useRouter } from "next/router";
import { svgIcons } from "../../data/svgIcons";
import { APP_URLS } from "../../lib/config";
import Tooltip from "../common/Tooltip";
import { useMediaQuery } from "@mui/material";

const HomeIntroVideo = () => {
  const { t } = useSafeTranslation();
  const router = useRouter();
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
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
    <div className="py-10 md:py-16 bg-white" id="vision-section">
      <div className="container mx-auto px-5 max-w-[95%]">
        <div className="flex flex-col md:flex-row gap-auto md:gap-[40px] items-stretch">
          <div className="text-center md:text-left md:w-1/2 text-[20px] lg:text-[22px] font-normal text-[#334155]">
            <div>
              <h1
                className={`font-libre font-normal  text-[#3A3A3A] ${isMobile ? "text-center text-[32px] leading-[42px] border-b border-[#CBD5E1] pb-2" : "text-[64px] leading-[78px] pb-[24px]"}`}
                style={
                  {
                    WebkitTextStrokeWidth: "0.5px",
                    WebkitTextStrokeColor: "#000",
                  } as React.CSSProperties
                }
              >
                {t("TAKING_COURT_TO_PEOPLE")}
              </h1>
              <p
                className={`font-roboto font-normal text-[#334155]  tracking-normal ${isMobile ? "text-center text-[17px] leading-[22px] pt-[24px] pb-[30px]" : "text-[28px] leading-[36px] pt-[24px] pb-[30px]"}`}
              >
                {t("COURT_DESCRIPTION")}
              </p>
              <div
                className={`flex flex-row gap-4 ${isMobile ? "justify-center" : ""}`}
              >
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
                      className="w-max absolute left-0 top-full mt-1 bg-white border-[2px] border-[#E2E8F0] rounded-[12px] shadow-lg z-[9999] min-w-[135px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="relative overflow-visible"
                        onMouseEnter={() => setShowCitizenTooltip(true)}
                        onMouseLeave={() => setShowCitizenTooltip(false)}
                      >
                        <button
                          className="px-4 text-left text-[#3A3A3A] hover:bg-gray-50 transition-colors flex justify-center items-center gap-2 text-sm hover:text-[#0F766E] w-full"
                          onClick={() => {
                            window.open(APP_URLS.CITIZEN_DRISTI, "_blank");
                            setLoginDropdownOpen(false);
                          }}
                        >
                          <span
                            className={
                              isMobile
                                ? "py-3 border-b border-[#CBD5E1] text-center font-roboto font-medium text-[14px] leading-[20px] text-[#3A3A3A]"
                                : "py-3 border-b border-[#CBD5E1] font-roboto font-medium text-[24px] leading-[28px] tracking-[-0.24px] text-[#3A3A3A] hover:text-[#0F766E]"
                            }
                          >
                            {" "}
                            {t("ADVOCATE_LITIGANT_LOGIN")}
                          </span>
                        </button>
                        {showCitizenTooltip && !isMobile && (
                          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[99999]">
                            <Tooltip text={t("CITIZEN_LOGIN_TOOLTIP")} />
                          </div>
                        )}
                      </div>
                      <div
                        className="relative overflow-visible"
                        onMouseEnter={() => setShowEmployeeTooltip(true)}
                        onMouseLeave={() => setShowEmployeeTooltip(false)}
                      >
                        <button
                          className="px-4 text-left text-[#3A3A3A] hover:bg-gray-50 transition-colors flex justify-center items-center gap-2 text-sm hover:text-[#0F766E] w-full"
                          onClick={() => {
                            window.open(APP_URLS.EMPLOYEE_USER, "_blank");
                            setLoginDropdownOpen(false);
                          }}
                        >
                          <span
                            className={
                              isMobile
                                ? "py-3 text-center font-roboto font-medium text-[14px] leading-[20px] text-[#3A3A3A]"
                                : "py-3 font-roboto font-medium text-[24px] leading-[28px] tracking-[-0.24px] text-[#3A3A3A] hover:text-[#0F766E]"
                            }
                          >
                            {t("JUDGE_STAFF_LOGIN")}
                          </span>
                        </button>
                        {showEmployeeTooltip && !isMobile && (
                          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[99999]">
                            <Tooltip text={t("JUDGE_STAFF_LOGIN_TOOLTIP")} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className="relative"
                  onMouseEnter={() => setShowSearchTooltip(true)}
                  onMouseLeave={() => setShowSearchTooltip(false)}
                >
                  <button
                    className={`box-border text-[white] flex flex-row items-center justify-center gap-4  bg-[white] border border-[#0F766E] rounded-[12px] ${isMobile ? "h-[40px] w-[135px] px-[12px] py-2" : "h-[69px] w-[241px] px-4 py-8"}`}
                    onClick={() => router.push("/search")}
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
                  {showSearchTooltip && !isMobile && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[99999]">
                      <Tooltip text={t("CASE_SEARCH_TOOLTIP")} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 mt-6 md:mt-0">
            <div>
              <div className="relative rounded-lg overflow-hidden shadow-lg aspect-video">
                {!isPlaying ? (
                  <div
                    className="relative w-full h-full cursor-pointer group"
                    onClick={() => setIsPlaying(true)}
                  >
                    <Image
                      src="/images/homeIntroThumbnail.png"
                      alt="Police Station Map"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white bg-opacity-80 group-hover:bg-opacity-100 flex items-center justify-center transition-all duration-300">
                        <svg
                          className="w-8 h-8 md:w-10 md:h-10 text-emerald-700"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
                    title="ON Courts Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeIntroVideo;
