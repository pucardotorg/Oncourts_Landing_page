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
  }, [fetchCasesForDate, searchValue, selectedDate]);

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
        <p data-tip data-for={`hearing-list`}>
          {hearingItem?.advocate?.complainant?.length > 0 &&
            `${hearingItem?.advocate?.complainant?.[0]} (C)${
              hearingItem?.advocate?.complainant?.length === 2
                ? " + 1 Other"
                : hearingItem?.advocate?.complainant?.length > 2
                  ? ` + ${hearingItem?.advocate?.complainant?.length - 1} others`
                  : ""
            }`}
        </p>
        <p data-tip data-for={`hearing-list`}>
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
          <table className="min-w-full bg-white text-sm text-left">
            <thead
              className="bg-gray-100 text-gray-700"
              style={{ position: "sticky", top: 0, color: "#0F172A" }}
            >
              <tr>
                <th className="px-4 py-2 border-t border-b border-slate-200">
                  {t("SL_NO")}
                </th>
                <th className="px-4 py-2 border-t border-b border-slate-200">
                  {t("CASE_TITLE")}
                </th>
                <th className="px-4 py-2 border-t border-b border-slate-200">
                  {t("ADVOCATES")}
                </th>
                <th className="px-4 py-2 border-t border-b border-slate-200">
                  {t("CASE_NUMBER")}
                </th>
                <th className="px-4 py-2 border-t border-b border-slate-200">
                  {t("PURPOSE")}
                </th>
                <th className="px-6 py-2 border-t border-b border-slate-200">
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
                  <td className="min-w-[150px] px-4 py-2 border-b border-slate-200">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${getStatusStyle(hearingItem.status || "")}`}
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

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 py-4 bg-white">
      {isMobile ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <h1 className="font-libre font-normal text-[32px] leading-[40px] text-center tracking-[-0.6px] text-[#3A3A3A] mb-2">
            {t("DISPLAY_CAUSELIST_HEADING")}
          </h1>
          <p className="text-center text-gray-600 mb-6 text-sm sm:text-base font-medium leading-6 sm:leading-10">
            {t("DISPLAY_CAUSELIST_SUB_HEADING")}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 p-4 rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.16)] border border-[#E2E8F0] mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
              <div className="flex justify-left font-roboto font-normal text-[16px] leading-[19px] text-[#0B0C0C]">
                <label className="font-normal text-slate-900 text-center">
                  {t("VIEW_CASE_SCHEDULE_BY_DATE")}
                </label>
              </div>

              <input
                type="date"
                className="border px-2 py-1 h-[40px] w-full sm:w-[220px] text-sm text-slate-700 bg-[white] border-[#505A5F] rounded-[6px]"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSearchValue("");
                }}
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
                    <span className="font-bold text-sm text-slate-700 ml-2">
                      {t("DOWNLOAD_CAUSELIST")}
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-[15px] leading-[18px] tracking-[-0.16px] text-slate-700 text-center">
                    <svgIcons.InfoIcon width="64" />
                    <span>
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
            {showRefreshSection && (
              <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 border-t border-slate-300 py-6 gap-6">
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
            <h2 className="font-semibold text-center text-[24px] leading-[28px] tracking-[-0.24px]">
              {t("CASE_SCHEDULE_HEADING")} |{" "}
              <span className="text-[#0F766E] font-bold">
                {formattedDateV2(selectedDate)}
              </span>
            </h2>

            {showRefreshSection && (
              <div className="flex items-center gap-2 justify-center ">
                <span
                  className="cursor-pointer"
                  onClick={() => fetchCasesForDate(selectedDate, searchValue)}
                >
                  {svgIcons.RefreshIcon()}
                </span>
                {showRefreshTime && (
                  <span className="text-blue-600 font-roboto font-medium text-[14px] leading-[17px]">{`${t("LAST_REFRESHED_ON")} ${refreshedAt}`}</span>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-[310px]">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <svgIcons.SearchIcon2 />
                </span>
                <input
                  type="text"
                  placeholder="Search by case name, ID or advocate"
                  className="h-[34px] border border-gray-300 bg-[#f8fbfd] text-slate-700 placeholder-gray-500 text-sm font-medium pl-10 pr-3 py-1.5 rounded-md w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  className="w-[25%] h-[32px] text-sm font-bold border border-[#0F766E] text-[#0F766E] rounded"
                  onClick={() => fetchCasesForDate(selectedDate, searchValue)}
                >
                  {t("COMMON_SEARCH")}
                </button>
                <button
                  className="w-[25%] h-[32px] text-sm font-bold border border-[#E2E8F0] shadow-[0px_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_rgba(0,0,0,0.06)] text-[#64748B] rounded"
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
                <p className="text-red-600 font-bold text-sm p-2 border-t border-slate-300">
                  {t(error)}
                </p>
              ) : hearingData?.length === 0 ? (
                <p className="text-red-600 font-roboto font-medium text-[20px] leading-[26px] tracking-[-0.2px] p-2 border-t border-slate-300">
                  {t("NO_CASE_SCHEDULED_FOR_THIS_DATE")}
                </p>
              ) : (
                <div className="">
                  <div className="border border-[#E2E8F0] bg-[#F8FAFC]">
                    <div
                      className={`grid grid-cols-[45%_45%_10%] items-center px-[5px] cursor-pointer h-[41px] relative`}
                    >
                      <div className="absolute left-[45%] top-0 bottom-0 w-[1px] bg-[#E2E8F0]"></div>
                      <span className="h-[21px] font-inter font-semibold text-[14.07px] leading-[20px] text-[#0F172A] pr-[5px]">
                        {t("CASE_NUMBER")}:
                      </span>
                      <span
                        className={`flex flex-row justify-center items-center py-[8.22px] ml-[10px] w-max gap-[4.11px] h-[20.55px] rounded-[4.19px]`}
                      >
                        <h2
                          className={`font-inter font-semibold text-[14.07px] leading-[20px] text-[#0F172A]`}
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
        <div className="max-w-6xl mx-auto p-6">
          <h1
            className="text-3xl font-bold text-center mb-2"
            style={{
              color: "#3A3A3A",
              fontFamily: "Libre Baskerville, serif",
              fontWeight: "500",
              fontSize: "40px",
            }}
          >
            {t("DISPLAY_CAUSELIST_HEADING")}
          </h1>
          <p
            className="text-center text-gray-600 mb-6"
            style={{
              lineHeight: "40px",
              color: "#334155",
              fontWeight: "500",
            }}
          >
            {t("DISPLAY_CAUSELIST_SUB_HEADING")}
          </p>

          <div
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 p-4 rounded-md border mb-6"
            style={{ justifyContent: "center" }}
          >
            <div className="flex items-center gap-2">
              <label
                style={{
                  color: "#0F172A",
                  fontWeight: "700",
                }}
              >
                {t("VIEW_CASE_SCHEDULE_BY_DATE")}
              </label>
              <input
                type="date"
                className="border px-2 py-1 rounded"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSearchValue("");
                }}
                style={{
                  width: "220px",
                  height: "32px",
                  borderRadius: "4px",
                  border: "1.44px solid #334155",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  color: "#334155",
                }}
              />
            </div>
            {hearingData?.length > 0 && (
              <div>
                {showDownloadCauseListButton ? (
                  <React.Fragment>
                    <button
                      style={{
                        width: "190px",
                        height: "34px",
                        borderRadius: "4px",
                        border: "1px solid #CBD5E1",
                        backgroundColor:
                          "rgb(243 244 246 / var(--tw-bg-opacity))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow:
                          "0 1px 2px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.06)",
                        transition: "box-shadow 0.2s ease, transform 0.2s ease",
                      }}
                      onClick={handleDownloadCauseList}
                    >
                      <svgIcons.DownloadIcon2 />
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "13px",
                          marginLeft: "5px",
                          color: "#334155",
                          opacity: 0.9,
                        }}
                      >
                        {t("DOWNLOAD_CAUSELIST")}
                      </div>
                    </button>
                  </React.Fragment>
                ) : (
                  <div
                    className="cause-list-not-generated-message-section"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      justifyContent: "center",
                    }}
                  >
                    <svgIcons.InfoIcon />
                    <span style={{ maxWidth: "290px", fontSize: "14px" }}>
                      {t("THE_CAUSE_LIST_FOR_THIS_DAY_WILL_BE_AVAILABLE_AFTER")}
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

          <div
            className="case-search-filter-section flex justify-between items-center mb-2"
            style={{ height: "51px" }}
          >
            <h2 className="text-lg font-semibold" style={{ fontSize: "22px" }}>
              {t("CASE_SCHEDULE_HEADING")} |{" "}
              <span
                className=""
                style={{
                  color: "#0F766E",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "22px",
                  fontWeight: 700,
                }}
              >
                {formattedDateV2(selectedDate)}
              </span>
            </h2>
            <div
              className="search-section-main"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <div
                className="search-case-filter-input-section relative w-72"
                style={{
                  width: "310px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"
                  style={{ paddingLeft: "20px" }}
                >
                  <svgIcons.SearchIcon2 />
                </span>
                <span style={{ width: "100%", paddingLeft: "10px" }}>
                  <input
                    type="text"
                    placeholder="Search by case name, ID or advocate"
                    style={{ backgroundColor: "#F8FAFC" }}
                    className="h-[30px] border border-gray-300 bg-[#f8fbfd] text-gray-700 placeholder-gray-500 placeholder:text-[14px] text-slate-500 font-medium pl-10 pr-3 py-1.5 rounded-md w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                style={{
                  border: "solid 1px #0F766E",
                  color: "#0F766E",
                  fontSize: "13px",
                  borderRadius: "5px",
                  height: "30px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  width: "60px",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={() => fetchCasesForDate(selectedDate, searchValue)}
              >
                {t("COMMON_SEARCH")}
              </button>
              <button
                style={{
                  border: "solid 1px #64748B",
                  color: "#64748B",
                  fontSize: "13px",
                  borderRadius: "5px",
                  height: "30px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  width: "60px",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
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
            <div
              className="flex items-center justify-between text-sm text-gray-600 mb-2"
              style={{
                borderTop: "solid 1px #CBD5E1",
                borderBottom: "solid 1px #CBD5E1",
                paddingTop: "7px",
                paddingBottom: "7px",
              }}
            >
              <div className="join-onoine-hearing-section flex items-center gap-2">
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
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#3A3A3A",
                          color: "white",
                          width: "175px",
                          height: "32px",
                          borderRadius: "3px",
                        }}
                      >
                        <span style={{ marginRight: "5px" }}>
                          <svgIcons.VideoCallIcon />
                        </span>
                        <span style={{ fontWeight: "500", fontSize: "13px" }}>
                          {t("JOIN_HEARING_ONLINE")}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div
                className="last-refreshed-time-section"
                style={{
                  display: "flex",
                  alignItems: "center",
                  opacity: "0.9",
                }}
              >
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    fetchCasesForDate(selectedDate, searchValue);
                  }}
                >
                  {svgIcons.RefreshIcon()}
                </span>
                {showRefreshTime && (
                  <span
                    style={{
                      color: "#2563EB",
                      fontWeight: "700",
                      marginLeft: "10px",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
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
                <p
                  style={{
                    fontSize: "15px",
                    color: "#DC2626",
                    fontWeight: "700",
                    padding: "10px",
                    borderTop: "solid 1px  #CBD5E1",
                  }}
                  className=""
                >
                  {t(error)}
                </p>
              ) : hearingData?.length === 0 ? (
                <p
                  style={{
                    fontSize: "15px",
                    color: "#DC2626",
                    fontWeight: "700",
                    padding: "10px",
                    borderTop: "solid 1px  #CBD5E1",
                  }}
                  className=""
                >
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
