import React, { useCallback, useEffect, useMemo, useState } from "react";

interface HearingItem {
  hearingNumber?: string;
  caseTitle?: string;
  advocate?: {
    complainant?: string[];
    accused?: string[];
  };
  hearingType?: string;
  status?: string;
  caseNumber?: string;
}
import { svgIcons } from "../../data/svgIcons";
import { commonStyles } from "../../styles/commonStyles";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import ExpandableCardV2 from "../../components/TableRow/ExpandableCardV2";
import { useMediaQuery } from "@mui/material";
import CustomDatePicker from "../../components/ui/form/CustomDatePicker";

export const getStatusStyle = (status: string) => {
  switch (status) {
    case "IN_PROGRESS":
      return "bg-pistachio text-darkGreen";
    case "SCHEDULED":
      return "bg-peach text-darkBrown";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
};

const formattedDateV2 = (selectedDate: string) => {
  const date = new Date(selectedDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function DisplayBoard() {
  const isMobile = useMediaQuery("(max-width:640px)");
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();

    // If current time is after or at 5:00 PM IST, set to tomorrow
    if (hour > 17 || (hour === 17 && minutes >= 0)) {
      now.setDate(now.getDate() + 1);
    }
    // Format as 'YYYY-MM-DD'
    return now.toISOString().split("T")[0];
  });

  const [hearingData, setHearingData] = useState<HearingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [hearingLink, setHearingLink] = useState("");
  const [error, setError] = useState("");
  const { t } = useSafeTranslation();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const tenantId = localStorage.getItem("tenant-id") || "kl";

  useEffect(() => {
    const fetchHearingLink = async () => {
      try {
        const response = await fetch("/api/hearingLink");
        const data = await response.json();
        setHearingLink(data.link);
      } catch (error) {
        console.error("Error fetching hearing link:", error);
      }
    };

    fetchHearingLink();
  }, []);

  const fetchCasesForDate = useCallback(
    async (dateStr: string, searchValue: string) => {
      const fromDate = new Date(dateStr).setHours(0, 0, 0, 0);
      const toDate = new Date(dateStr).setHours(23, 59, 59, 999);

      const payload = {
        tenantId,
        fromDate,
        toDate,
        searchText: searchValue || "",
      };

      try {
        setLoading(true);
        setError("");
        const response = await fetch("/api/hearing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const contentType = response.headers.get("content-type");
        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            "API responded with error:",
            response.status,
            errorText
          );
          setError("SOMETHING_WENT_WRONG_TRY_LATER_OR_REFRESH");
          setHearingData([]);
          return [];
        }

        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          const hearings = data?.openHearings || [];
          setHearingData(hearings);
          return hearings;
        } else {
          const text = await response.text();
          console.error("Unexpected non-JSON response from API:", text);
          setError("SOMETHING_WENT_WRONG_TRY_LATER_OR_REFRESH");
          setHearingData([]);
          return [];
        }
      } catch (error) {
        console.error("Error fetching hearings:", error);
        setError("SOMETHING_WENT_WRONG_TRY_LATER_OR_REFRESH");
        setHearingData([]);
        return [];
      } finally {
        setRefreshedAt(new Date().toLocaleString());
        setLoading(false);
      }
    },
    [tenantId]
  );

  useEffect(() => {
    fetchCasesForDate(selectedDate, searchValue);
  }, [fetchCasesForDate, selectedDate]); // Do not put searchValue in the dependency array, otherwise search api calls evrtytime user changes input(which is not as per requirement).

  useEffect(() => {
    // If selected date from calendar is today's date and current time is in between 11 AM and 5 PM
    // and If any single hearing is found in a stage except "COMPLETED",
    // then we keep refreshing the page every 30 seconds and keep calling the fetchCasesForDate API until ....
    // ...until either it's 5PM or all hearings all in "COMPLETED" stage, whichever happens first.

    // If selected date from calendar is today's date, and there are some hearings sheduled today,
    //  but some time is left for 11 AM , so we calculate that time and set a timeout to start the auto refresh.

    let interval: NodeJS.Timeout | null = null;
    let timeoutToStart: NodeJS.Timeout | null = null;
    const startAutoRefresh = () => {
      interval = setInterval(async () => {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const endMinutes = 17 * 60; // 5:00 PM
        const isPastFivePM = currentMinutes >= endMinutes;
        try {
          const refreshedHearings = await fetchCasesForDate(
            selectedDate,
            searchValue
          );

          const stillHasPending = refreshedHearings?.some(
            (hearing) => hearing.status !== "COMPLETED"
          );

          if (isPastFivePM || (!stillHasPending && searchValue === "")) {
            // stop interval only when there is no data without search filter
            if (interval) {
              clearInterval(interval);
              interval = null;
            }
          }
        } catch (err) {
          console.error("Auto refresh API error:", err);
        }
      }, 30 * 1000); // refresh every 30 seconds
    };

    const init = async () => {
      const now = new Date();
      const currentDateStr = now.toISOString().split("T")[0];
      const isToday = selectedDate === currentDateStr;
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const startMinutes = 11 * 60; // 11:00 AM
      const endMinutes = 17 * 60; // 5:00 PM

      const shouldStartAutoRefresh = () => {
        return hearingData?.some(
          (hearingItem) => hearingItem.status !== "COMPLETED"
        );
      };

      if (!isToday) return;

      if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
        if (shouldStartAutoRefresh() || Boolean(error) || searchValue !== "") {
          startAutoRefresh();
        }
      } else if (
        currentMinutes < startMinutes &&
        (hearingData?.length > 0 || Boolean(error) || searchValue !== "")
      ) {
        const diffMs = (startMinutes - currentMinutes) * 60 * 1000;

        timeoutToStart = setTimeout(() => {
          startAutoRefresh();
        }, diffMs);
      }
    };

    init();

    return () => {
      if (interval) clearInterval(interval);
      if (timeoutToStart) clearTimeout(timeoutToStart);
    };
  }, [selectedDate, fetchCasesForDate, hearingData, error, searchValue]);

  const showRefreshSection = useMemo(() => {
    const now = new Date();
    const currentDateStr = now.toISOString().split("T")[0];
    if (selectedDate >= currentDateStr) {
      return true;
    }
    return false;
  }, [selectedDate]);

  const showRefreshTime = useMemo(() => {
    const now = new Date();
    const currentDateStr = now.toISOString().split("T")[0];
    const isToday = selectedDate === currentDateStr;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = 11 * 60; // 11:00 AM
    const endMinutes = 17 * 60; // 5:00 PM

    const isAllHearingsNotCompleted = () => {
      return hearingData?.some(
        (hearingItem) => hearingItem.status !== "COMPLETED"
      );
    };

    if (
      isToday &&
      currentMinutes >= startMinutes &&
      currentMinutes < endMinutes &&
      (isAllHearingsNotCompleted() || Boolean(error) || searchValue !== "")
    ) {
      return true;
    }
    return false;
  }, [selectedDate, hearingData, error, searchValue]);

  const advocates = useCallback((hearingItem) => {
    return (
      <React.Fragment>
        <p
          data-tip
          data-for={`hearing-list`}
          className="text-[22.2px] leading-[31.72px]"
        >
          {hearingItem?.advocate?.complainant?.length > 0 &&
            `${hearingItem?.advocate?.complainant?.[0]} (C)${
              hearingItem?.advocate?.complainant?.length === 2
                ? " + 1 Other"
                : hearingItem?.advocate?.complainant?.length > 2
                  ? ` + ${hearingItem?.advocate?.complainant?.length - 1} others`
                  : ""
            }`}
        </p>
        <p
          data-tip
          data-for={`hearing-list`}
          className={`text-[22.2px] leading-[31.72px] ${hearingItem?.advocate?.accused?.length > 0 ? "pt-[8px]" : ""}`}
        >
          {hearingItem?.advocate?.accused?.length > 0 &&
            `${hearingItem?.advocate?.accused?.[0]} (A)${
              hearingItem?.advocate?.accused?.length === 2
                ? " + 1 Other"
                : hearingItem?.advocate?.accused?.length > 2
                  ? ` + ${hearingItem?.advocate?.accused?.length - 1} others`
                  : ""
            }`}
        </p>
      </React.Fragment>
    );
  }, []);

  const hearingsTable = useMemo(() => {
    return (
      <>
        {/* Desktop/tablet view */}
        <div
          className="hidden sm:block overflow-auto rounded border"
          style={{ maxHeight: "70vh" }}
        >
          <table className="min-w-full bg-white text-[22.2px] leading-[31.72px] text-left font-roboto">
            <thead
              className="bg-gray-100 text-[#0F172A] h-[57.1px]"
              style={{ position: "sticky", top: 0 }}
            >
              <tr>
                <th className="px-4 py-2 border-t border-b border-slate-200 font-semibold">
                  {t("SL_NO")}
                </th>
                <th className="px-4 py-2 border-t border-b border-slate-200 font-semibold">
                  {t("CASE_TITLE")}
                </th>
                <th className="px-4 py-2 border-t border-b border-slate-200 font-semibold">
                  {t("ADVOCATES")}
                </th>
                <th className="px-4 py-2 border-t border-b border-slate-200 font-semibold">
                  {t("CASE_NUMBER")}
                </th>
                <th className="px-4 py-2 border-t border-b border-slate-200 font-semibold">
                  {t("PURPOSE")}
                </th>
                <th className="px-6 py-2 border-t border-b border-slate-200 w-[162px] font-semibold">
                  {t("HEARING_STATUS")}
                </th>
              </tr>
            </thead>
            <tbody>
              {hearingData.map((hearingItem, index) => (
                <tr
                  key={hearingItem?.hearingNumber || index}
                  className="border-b text-slate-700"
                >
                  <td className="px-4 py-2 border-b border-slate-200">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border-b border-slate-200">
                    {t(hearingItem.caseTitle || "")}
                  </td>
                  <td className="px-4 py-2 border-b border-slate-200">
                    {advocates(hearingItem)}
                  </td>
                  <td className="px-4 py-2 border-b border-slate-200">
                    {t(hearingItem.caseNumber || "")}
                  </td>
                  <td className="px-4 py-2 border-b border-slate-200">
                    {t(hearingItem.hearingType || "")}
                  </td>
                  <td className="min-w-[150px] px-4 py-2 border-b border-slate-200 w-[162px] text-[20.61px] leading-[31.72px] font-medium">
                    <span
                      className={`px-2 py-1 rounded ${getStatusStyle(hearingItem.status || "")}`}
                    >
                      {t(hearingItem.status || "")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }, [hearingData, t, advocates]);

  const handleDownloadCauseList = async () => {
    try {
      const response = await fetch("api/_download", {
        method: "POST",
        headers: {
          Accept: "application/json,text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenantId,
          Criteria: {
            courtId: "KLKM52",
            searchDate: selectedDate,
          },
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || `HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileURL;
      const date = formatDate(selectedDate);
      link.download = `causelist-${date}.pdf`;
      link.click();
    } catch (error) {
      console.error("Download failed:", (error as Error).message, error);
      alert(
        `Failed to download: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const showDownloadCauseListButton = useMemo(() => {
    if (!selectedDate) return false;

    const now = new Date();
    const selected = new Date(selectedDate + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAt5 = new Date(today);
    todayAt5.setHours(17, 0, 0, 0);

    if (selected <= today) {
      return true;
    }
    if (selected.getTime() === tomorrow.getTime() && now >= todayAt5) {
      return true;
    }
    return false;
  }, [selectedDate]);

  const isInProgressHearing = useMemo(() => {
    const onGoingHearing = hearingData?.find(
      (hearing) => hearing.status === "IN_PROGRESS"
    );
    if (onGoingHearing) {
      return {
        caseTitle: onGoingHearing.caseTitle || null,
        caseNumber: onGoingHearing.caseNumber || null,
      };
    }
    return { caseTitle: null, caseNumber: null };
  }, [hearingData]);

  const handleCalendarIconClick = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 py-4 bg-white">
      {isMobile ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="text-[#3a3a3a] text-center text-[32px] leading-[40px] tracking-[-0.6px] font-libre border-b border-[#CBD5E1] pb-[16px] mb-[24px]">
            <h1 style={{ WebkitTextStrokeWidth: 0.5 }}>
              {t("DISPLAY_CAUSELIST_HEADING")}
            </h1>
          </div>
          <p className="text-center text-[#334155] mb-6 text-[17px] leading-[22px] tracking-[-0.18px] font-roboto">
            {t("DISPLAY_CAUSELIST_SUB_HEADING")}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 p-4 rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.16)] border border-[#E2E8F0] mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
              <div className="flex justify-left font-roboto font-normal text-[16px] leading-[19px] text-[#0B0C0C]">
                <label className="font-normal text-slate-900 text-center">
                  {t("VIEW_CASE_SCHEDULE_BY_DATE")}
                </label>
              </div>

              <CustomDatePicker
                selected={selectedDate ? new Date(selectedDate) : null}
                onChange={(date: Date | null) => {
                  setSelectedDate(date ? date.toISOString().split("T")[0] : "");
                  setSearchValue("");
                }}
                isOpen={isCalendarOpen}
                onIconClick={handleCalendarIconClick}
                onClickOutside={() => setIsCalendarOpen(false)}
                padding="px-1"
                borderRadius="rounded-md"
                borderColor="border-[#3D3C3C]"
                height="h-8"
                width="w-full"
                iconWidth="w-[15px]"
                iconHeight="h-[16px]"
              />
            </div>

            {hearingData?.length > 0 && (
              <div className="w-[100%] flex justify-center">
                {showDownloadCauseListButton ? (
                  <button
                    className="flex flex-row justify-center items-center px-3 w-[100%] h-[40px] gap-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-[12px] shadow-[inset_-2px_-2px_2px_rgba(15,23,42,0.14),inset_2px_2px_2px_1px_rgba(255,255,255,0.9)]"
                    onClick={handleDownloadCauseList}
                  >
                    <svgIcons.DownloadIcon2 />
                    <span className="font-medium text-[14px] leading-[20px] text-slate-700 ml-2 font-roboto">
                      {t("DOWNLOAD_CAUSELIST")}
                    </span>
                  </button>
                ) : (
                  <div className="h-[57px] rounded-[12px] pt-2 pb-2 flex flex-row flex-nowrap justify-center items-center gap-2 font-roboto">
                    <svgIcons.InfoIcon width="57" />
                    <span className="text-[#334155] text-left align-top text-[15px] tracking-[-0.16px] leading-[18px] border-none outline-none top-[2px]">
                      {t("THE_CAUSE_LIST_FOR_THIS_DAY_WILL_BE_AVAILABLE_AFTER")}{" "}
                      <span className="font-bold text-slate-800">
                        {t("5_PM_ON_PREVIOUS_DAY")}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            {isInProgressHearing?.caseNumber && (
              <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 border-t border-slate-300 gap-6 pt-[24px]">
                {isInProgressHearing?.caseNumber && (
                  <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left w-[100%]">
                    <button
                      className=" max-w-6xl mx-auto px-12 sm:px-12 py-4  flex flex-row justify-center font-roboto text-[14px] leading-[20px] font-medium items-center text-white px-3 w-[100%] h-[40px] gap-1 bg-[#3A3A3A] border border-[#CBD5E1] rounded-[12px] box-border"
                      onClick={() =>
                        hearingLink
                          ? window.open(hearingLink, "_blank")
                          : console.warn(t("HEARING_LINK_NOT_AVAILABLE"))
                      }
                    >
                      <span className="mr-2">
                        <svgIcons.VideoCallIcon />
                      </span>
                      {t("JOIN_HEARING_ONLINE")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4 mt-6">
            <div className="h-[28px] p-0 flex flex-row justify-start items-center gap-2 relative">
              <h2 className="text-left align-top text-[24px] font-roboto font-medium tracking-[-0.24px] leading-[28px] border-hidden outline-none self-start flex ">
                {t("CASE_SCHEDULE_HEADING")} |{" "}
              </h2>
              <span className=" text-[#0F766E] text-left align-top text-[24px] font-roboto font-medium tracking-[-0.24px] leading-[28px] border-hidden outline-none self-start flex ">
                {formattedDateV2(selectedDate)}
              </span>
              <div />
            </div>

            {showRefreshSection && (
              <div className="flex items-center gap-2 justify-center ">
                <span
                  className="cursor-pointer"
                  onClick={() => fetchCasesForDate(selectedDate, searchValue)}
                >
                  <svgIcons.RefreshIcon width="13.71" height="13.71" />
                </span>
                {true && (
                  <span className="text-[#2563EB] font-roboto font-medium text-[11.13px] leading-[17.13px]">{`${t("LAST_REFRESHED_ON")} ${refreshedAt}`}</span>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-[310px] h-[36px]">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <svgIcons.SearchIcon2 />
                </span>
                <input
                  type="text"
                  placeholder="Search by case name, ID or advocate"
                  className="h-[36px] border border-gray-300 bg-[#f8fbfd] text-slate-700 text-[15.43px] leading-[22px] font-roboto placeholder:font-roboto placeholder:text-[15.43px] placeholder:leading-[22px] placeholder:text-[#64748b] text-sm font-medium pl-10 pr-3 py-1.5 rounded-md w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  style={{ backgroundColor: "#F8FAFC" }}
                  onChange={(e) => setSearchValue(e.target.value)}
                  value={searchValue}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      fetchCasesForDate(selectedDate, searchValue);
                    }
                  }}
                />
              </div>
              {/* Mobile Search + Reset buttons */}
              <div className="flex justify-center items-center gap-2 mt-3 sm:hidden">
                <button
                  className="w-[25%] h-[32px] text-sm font-medium border border-[#0F766E] text-[#0F766E] rounded font-roboto"
                  onClick={() => fetchCasesForDate(selectedDate, searchValue)}
                >
                  {t("COMMON_SEARCH")}
                </button>
                <button
                  className="w-[25%] h-[32px] text-sm font-medium border border-[#E2E8F0] shadow-[0px_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_rgba(0,0,0,0.06)] text-[#64748B] rounded font-roboto"
                  onClick={() => {
                    setSearchValue("");
                    fetchCasesForDate(selectedDate, "");
                  }}
                >
                  {t("RESET")}
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className={commonStyles.loading.container}>
              <div className={commonStyles.loading.spinner}></div>
            </div>
          ) : (
            <>
              {Boolean(error) ? (
                <p className="text-[#DC2626] font-roboto font-medium text-[20px] leading-[26px] tracking-[-0.2px] p-2 pl-0 border-t border-slate-300">
                  {t(error)}
                </p>
              ) : hearingData?.length === 0 ? (
                <p className="text-[#DC2626] font-roboto font-medium text-[20px] leading-[26px] tracking-[-0.2px] p-2 pl-0 border-t border-slate-300">
                  {t("NO_CASE_SCHEDULED_FOR_THIS_DATE")}
                </p>
              ) : (
                <div className="">
                  <div className="border border-[#E2E8F0] bg-[#F8FAFC] font-roboto">
                    <div
                      className={`grid grid-cols-[45%_45%_10%] items-center px-[5px] font-semibold  cursor-pointer h-[41px] relative`}
                    >
                      <div className="absolute left-[45%] top-0 bottom-0 w-[1px] bg-[#E2E8F0]"></div>
                      <span className="h-[21px] font-roboto text-[14.07px] leading-[20px] text-[#0F172A] pr-[5px]">
                        {t("CASE_NUMBER")}:
                      </span>
                      <span
                        className={`flex flex-row justify-center items-center py-[8.22px] ml-[10px] w-max gap-[4.11px] h-[20.55px] rounded-[4.19px]`}
                      >
                        <h2
                          className={`font-roboto text-[14.07px] leading-[20px] text-[#0F172A]`}
                        >
                          {t("STATUS")}
                        </h2>
                      </span>
                    </div>
                  </div>
                  {hearingData.map((hearing, index) => (
                    <ExpandableCardV2
                      key={`${hearing.caseNumber}-${index}`}
                      caseData={{
                        caseNumber: hearing.caseNumber,
                        caseTitle: hearing.caseTitle,
                        purpose: hearing.hearingType,
                        status: hearing.status,
                        advocates: advocates(hearing),
                      }}
                      onViewDetails={() => {}}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="mx-auto p-6">
          <h1
            className="pb-[24px] text-[#3a3a3a] text-center align-top text-[64px] font-libre tracking-[-0.8px] leading-[70px]"
            style={{
              WebkitTextStrokeWidth: "0.5px",
            }}
          >
            {t("DISPLAY_CAUSELIST_HEADING")}
          </h1>
          <p className="text-[#334155] text-center align-top text-[28px] font-roboto tracking-[-0.56px] leading-[40px] outline-none">
            {t("DISPLAY_CAUSELIST_SUB_HEADING")}
          </p>

          <div
            className="bg-white rounded-[12px] p-6 mt-[36px] mb-[32px] flex flex-row justify-center items-center gap-6 relative border-[1.44px] border-[#CBD5E1] radius-[8px]"
            style={{ justifyContent: "center" }}
          >
            <div className="flex flex-row justify-center items-center gap-[24px]">
              <label className="text-[#0F172A] text-left align-top text-[28px] font-roboto font-medium tracking-[-0.56px] leading-[32px] border-none outline-none">
                {t("VIEW_CASE_SCHEDULE_BY_DATE")}
              </label>
              <div className="w-[423px]">
                <CustomDatePicker
                  selected={selectedDate ? new Date(selectedDate) : null}
                  onChange={(date: Date | null) => {
                    setSelectedDate(
                      date ? date.toISOString().split("T")[0] : ""
                    );
                    setSearchValue("");
                  }}
                  isOpen={isCalendarOpen}
                  onIconClick={handleCalendarIconClick}
                  onClickOutside={() => setIsCalendarOpen(false)}
                  padding="px-1"
                  borderRadius="rounded-[8px]"
                  borderColor="border-[#3D3C3C]"
                  height="h-[56px]"
                  fontStyle="text-[23px] leading-[34.6px]"
                  iconWidth="w-[34.6px]"
                  iconHeight="h-[33.9px]"
                />
              </div>
              {hearingData?.length > 0 && (
                <div>
                  {showDownloadCauseListButton ? (
                    <React.Fragment>
                      <button
                        className="flex relative h-[57px] w-[291px] bg-[#f8fafc] border-[1.59px] border-[#CBD5E1] rounded-[6.344px] px-[12.688px] justify-center items-center gap-[6.344px] shadow-md transition-shadow transform duration-200 ease-in-out"
                        onClick={handleDownloadCauseList}
                      >
                        <svgIcons.DownloadIcon2 width="25.38" height="25.38" />
                        <div className="text-[#334155] text-center align-top text-[20.62px] font-roboto font-medium leading-[31.72px] border-none outline-none ">
                          {t("DOWNLOAD_CAUSELIST")}
                        </div>
                      </button>
                    </React.Fragment>
                  ) : (
                    <div className="bg-white h-[57px]  rounded-[12px] px-[12px] py-[16px] flex flex-row justify-center items-center gap-[8px]">
                      <span>
                        <svgIcons.InfoIcon width="46" />
                      </span>
                      <span className="w-[369px] font-roboto text-slate-700 text-left text-[20px] leading-[26px] tracking-[-0.2px] border-none outline-none ">
                        {t(
                          "THE_CAUSE_LIST_FOR_THIS_DAY_WILL_BE_AVAILABLE_AFTER"
                        )}
                        <span style={{ color: "#334155", fontWeight: "bold" }}>
                          {" "}
                          {t("5_PM_ON_PREVIOUS_DAY")}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div
            className="case-search-filter-section flex justify-between items-center mb-[16px]"
            style={{ height: "51px" }}
          >
            <h2 className="w-[462px] h-[45px] text-[36px] font-roboto font-medium leading-[44.41px] tracking-[-0.38px] flex justify-center items-center gap-[8px]">
              {t("CASE_SCHEDULE_HEADING")} |{" "}
              <span className="text-[#0F766E]">
                {formattedDateV2(selectedDate)}
              </span>
            </h2>
            <div className="h-[51px] p-0 flex flex-row justify-start items-start gap-[10px] relative">
              <div className="bg-[#f8fafc] h-[50.75px] font-roboto w-[483px] rounded-[9.52px] py-[12.69px] flex flex-row flex-nowrap justify-start items-center gap-[12.69px] relative">
                <span className="absolute inset-y-0 ml-[15px] flex items-center text-gray-500">
                  <svgIcons.SearchIcon2 width="32" height="32" />
                </span>
                <span className="w-full">
                  <input
                    type="text"
                    placeholder="Search by case name, ID or advocate"
                    style={{ backgroundColor: "#F8FAFC" }}
                    className="h-[50.75px] border border-gray-300 bg-[#f8fbfd] text-gray-700 placeholder:font-normal placeholder:text-[#64748B] placeholder:text-[22px] placeholder:leading-[32px] text-[#64748B] font-roboto pl-[60px]  py-1.5 rounded-md w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onChange={(e) => setSearchValue(e.target.value)}
                    value={searchValue}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        fetchCasesForDate(selectedDate, searchValue);
                      }
                    }}
                  />
                </span>
              </div>
              <button
                className="bg-white h-[51px] w-[96px] shadow-[0px_1px_3px_rgba(0,0,0,0.1)] border border-[#0F766E] rounded-[6px] px-[6px] py-[4px] flex flex-row justify-center items-center gap-[12px] relative cursor-pointer text-[#0f766e] font-roboto font-medium text-[20px] tracking-[-0.2px] leading-[24px]"
                onClick={() => fetchCasesForDate(selectedDate, searchValue)}
              >
                {t("COMMON_SEARCH")}
              </button>
              <button
                className="bg-white h-[51px] w-[96px] shadow-[0px_1px_3px_rgba(0,0,0,0.1)] border border-[#64748B] rounded-[6px] px-[6px] py-[4px] flex flex-row justify-center items-center gap-[12px] relative cursor-pointer text-[#64748B] font-roboto font-medium text-[20px] tracking-[-0.2px] leading-[24px]"
                onClick={() => {
                  setSearchValue("");
                  fetchCasesForDate(selectedDate, "");
                }}
              >
                {t("RESET")}
              </button>
            </div>
          </div>
          {showRefreshSection && (
            <div className="h-[83px] flex items-center justify-between mb-[16px] border-t border-b border-[#CBD5E1] py-[16px]">
              <div className="join-onoine-hearing-section flex items-center justify-left gap-2 h-[51px]">
                {isInProgressHearing?.caseNumber && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <div className="join-hearing-online-button">
                      <button
                        onClick={() => {
                          if (hearingLink) {
                            window.open(hearingLink, "_blank");
                          } else {
                            console.warn(t("HEARING_LINK_NOT_AVAILABLE"));
                          }
                        }}
                        className="bg-[#3a3a3a] h-[51px] w-[245px] rounded-[6.344px] px-[12.688px] flex flex-row justify-center items-center gap-[6.344px] relative border-none outline-none"
                      >
                        <span className="mr-[5px]">
                          <svgIcons.VideoCallIcon
                            width="25.38"
                            height="25.38"
                          />
                        </span>
                        <span className="text-white font-roboto font-medium text-[20.61px] leading-[31.72px]">
                          {t("JOIN_HEARING_ONLINE")}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-[6.34px] font-medium">
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    fetchCasesForDate(selectedDate, searchValue);
                  }}
                >
                  <svgIcons.RefreshIcon width="25.38" height="25.38" />
                </span>
                {showRefreshTime && (
                  <span className="text-[#2563EB] font-roboto text-[20.61px] leading-[31.72px]">
                    {`${t("LAST_REFRESHED_ON")} ${refreshedAt}`}
                  </span>
                )}
              </div>
            </div>
          )}

          {loading ? (
            <div className={commonStyles.loading.container}>
              <div className={commonStyles.loading.spinner}></div>
            </div>
          ) : (
            <React.Fragment>
              {" "}
              {Boolean(error) ? (
                <p className="flex justify-left pl-[12px] items-center flex-row text-[#dc2626] h-[57px] text-left text-[20px] leading-[26px] tracking-[-0.2px] font-['Roboto'] py-[8px]">
                  {t(error)}
                </p>
              ) : hearingData?.length === 0 ? (
                <p className="flex justify-left pl-[12px] items-center flex-row text-[#dc2626] h-[57px] text-left text-[20px] leading-[26px] tracking-[-0.2px] font-['Roboto'] py-[8px]">
                  {t("NO_CASE_SCHEDULED_FOR_THIS_DATE")}
                </p>
              ) : (
                hearingsTable
              )}
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  );
}
