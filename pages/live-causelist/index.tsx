import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import Image from "next/image";
import { svgIcons } from "../../data/svgIcons";

// Types aligned with DisplayBoard
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
  serialNumber?: number;
}

// API response shape for /api/hearing
interface HearingResponse {
  openHearings?: HearingItem[];
}

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

export const getTopCardBackgroundColor = (status: string) => {
  switch (status) {
    case "IN_PROGRESS":
      return "bg-[#E4F2E4] border border-[#E8E8E8]";
    case "SCHEDULED":
      return "bg-[#FFFAF6] border border-[#E8E8E8]";
    default:
      return "bg-[#E8E8E8] border border-[#E8E8E8]";
  }
};

const getTopCardStatusTextBackgroundColor = (
  index: number,
  status: string,
  inCompletedHearings: HearingItem[],
  key: string
) => {
  const info = { text: "", style: "" };
  if (status === "IN_PROGRESS") {
    info.style = "bg-[#15803D] border border-[ #16A34A]";
    info.text = "IN_PROGRESS";
    return info[key];
  }
  switch (index) {
    case 0:
      if (status === "SCHEDULED") {
        info.style = "bg-[#0F3B8C] border border-[ #0F3B8C]";
        info.text = "NEXT";
        return info[key];
      } else {
        info.style = "bg-white";
        info.text = status;
        return info[key];
      }
    case 1:
      if (status === "SCHEDULED") {
        if (inCompletedHearings?.[0]?.status === "IN_PROGRESS") {
          info.style = "bg-[#0F3B8C] border border-[ #0F3B8C]";
          info.text = "NEXT";
          return info[key];
        } else if (inCompletedHearings?.[0]?.status === "SCHEDULED") {
          info.style = "bg-[#6B21A8] border border-[ #6B21A8]";
          info.text = "UPCOMING";
          return info[key];
        }
      } else {
        info.style = "bg-white";
        info.text = status;
        return info[key];
      }
    case 2:
      if (status === "SCHEDULED") {
        if (inCompletedHearings?.[1]?.status === "IN_PROGRESS") {
          info.style = "bg-[#0F3B8C] border border-[ #0F3B8C]";
          info.text = "NEXT";
          return info[key];
        } else if (inCompletedHearings?.[1]?.status === "SCHEDULED") {
          info.style = "bg-[#6B21A8] border border-[ #6B21A8]";
          info.text = "UPCOMING";
          return info[key];
        }
      } else {
        info.style = "bg-white";
        info.text = status;
        return info[key];
      }
    case 3:
      if (status === "SCHEDULED") {
        if (inCompletedHearings?.[2]?.status === "IN_PROGRESS") {
          info.style = "bg-[#0F3B8C] border border-[ #0F3B8C]";
          info.text = "NEXT";
          return info[key];
        } else if (inCompletedHearings?.[2]?.status === "SCHEDULED") {
          info.style = "bg-[#6B21A8] border border-[ #6B21A8]";
          info.text = "UPCOMING";
          return info[key];
        }
      } else {
        info.style = "bg-white";
        info.text = status;
        return info[key];
      }
    default:
      return "";
  }
};

const formattedDateDisplay = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

function getLocalISOString() {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000; // offset in ms
  const localISOTime = new Date(now.getTime() - tzOffset)
    .toISOString()
    .slice(0, -1); // remove trailing 'Z'
  return localISOTime;
}

function calculateLastRefreshDay(refreshedAt: string | number | Date): string {
  const refreshDate = new Date(refreshedAt);
  const today = new Date();

  // Normalize both to midnight for local comparison
  const refreshDay = new Date(
    refreshDate.getFullYear(),
    refreshDate.getMonth(),
    refreshDate.getDate()
  );
  const todayDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const diffInDays =
    (todayDay.getTime() - refreshDay.getTime()) / (1000 * 60 * 60 * 24);

  // Format time for display (local)
  let hours = refreshDate.getHours();
  const minutes = refreshDate.getMinutes().toString().padStart(2, "0");
  const seconds = refreshDate.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;

  if (diffInDays === 0) {
    return `Today at ${formattedTime}`;
  } else if (diffInDays === 1) {
    return `Yesterday at ${formattedTime}`;
  } else {
    const dd = String(refreshDate.getDate()).padStart(2, "0");
    const mm = String(refreshDate.getMonth() + 1).padStart(2, "0");
    const yyyy = refreshDate.getFullYear();
    return `on ${dd}/${mm}/${yyyy} at ${formattedTime}`;
  }
}

const computeAutoDate = () => {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  if (hour > 17 || (hour === 17 && minutes >= 0)) {
    now.setDate(now.getDate() + 1);
  }
  return now.toISOString().split("T")[0];
};

export default function LiveCauselist() {
  const { t } = useSafeTranslation();
  // Configurable single interval (in ms) used for both fetching and pagination rotation
  const defaultUpdateInterval = 5000; // 5 seconds

  // Selected date: auto (no date selector)
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    computeAutoDate()
  );

  // Two datasets: status-sorted for top cards, index-sorted for paginated table
  const [sortedHearingsData, setSortedHearingsData] = useState<HearingItem[]>(
    []
  );
  const [indexedHearingsData, setIndexedHearingsData] = useState<HearingItem[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshedAt, setRefreshedAt] = useState<string>(getLocalISOString());
  const [updateInterval, setUpdateInterval] = useState(defaultUpdateInterval);

  // Pagination for bottom section (12 per page after the top 4)
  const [currentPage, setCurrentPage] = useState(0); // 0-based for the bottom pages

  const tenantId = useMemo(() => localStorage.getItem("tenant-id") || "kl", []);

  const getRefreshInterval = useCallback(async () => {
    try {
      const response = await fetch(
        `/egov-mdms-service/v1/_search?tenantId=${tenantId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            MdmsCriteria: {
              tenantId: tenantId,
              moduleDetails: [
                {
                  moduleName: "LandingPage",
                  masterDetails: [{ name: "LiveCauseListRefetchTimeInterval" }],
                },
              ],
            },
            RequestInfo: {
              apiId: "Rainmaker",
              msgId: `${Date.now()}|en_IN`,
            },
          }),
        }
      );
      const data = await response.json();
      const refreshInterval =
        data?.MdmsRes?.["LandingPage"]?.LiveCauseListRefetchTimeInterval?.[0]
          ?.timeInSecs;
      if (Boolean(refreshInterval)) {
        setUpdateInterval(refreshInterval * 1000);
      }
    } catch (error) {
      console.error("Error fetching court options:", error);
    }
  }, [tenantId]);

  useEffect(() => {
    getRefreshInterval();
  }, []);

  // Core fetcher with toggle for serial-number sorting
  const fetchHearings = useCallback(
    async (dateStr: string, isHearingSerialNumberSorting: boolean) => {
      const fromDate = new Date(dateStr).setHours(0, 0, 0, 0);
      const toDate = new Date(dateStr).setHours(23, 59, 59, 999);

      const payload = {
        tenantId,
        fromDate,
        toDate,
        searchText: "",
        isHearingSerialNumberSorting,
      };

      try {
        const response = await fetch("/api/hearing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          // Swallow error and return empty to avoid breaking the UI
          const text = await response.text().catch(() => "");
          console.warn("/api/hearing non-OK:", response.status, text);
          return [] as HearingItem[];
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const text = await response.text().catch(() => "");
          console.warn(
            "/api/hearing unexpected content-type:",
            contentType,
            text
          );
          return [] as HearingItem[];
        }

        const data: HearingResponse = await response.json().catch((e) => {
          console.warn("/api/hearing JSON parse failed:", e);
          return { openHearings: [] } as HearingResponse;
        });
        const hearings: HearingItem[] = data?.openHearings || [];
        return hearings;
      } catch (err) {
        // Network or other failures — return empty to keep UI stable
        console.warn("/api/hearing request failed:", err);
        return [] as HearingItem[];
      }
    },
    [tenantId]
  );

  // Fetch both datasets together
  const fetchBothForDate = useCallback(
    async (dateStr: string) => {
      try {
        setLoading(true);
        // Run both calls in parallel and tolerate one failing
        const results = await Promise.allSettled([
          fetchHearings(dateStr, false),
          fetchHearings(dateStr, true),
        ]);

        const sorted =
          results[0].status === "fulfilled"
            ? results[0].value
            : ([] as HearingItem[]);
        const indexed =
          results[1].status === "fulfilled"
            ? results[1].value
            : ([] as HearingItem[]);

        // Update state only if we have something, else keep previous to avoid flicker
        if (sorted.length > 0) setSortedHearingsData(sorted);
        if (indexed.length > 0) setIndexedHearingsData(indexed);

        // Manage error state: only set when both are empty
        if (sorted.length === 0 && indexed.length === 0) {
          setError("SOMETHING_WENT_WRONG_TRY_LATER_OR_REFRESH");
        } else {
          setError("");
        }

        return { sorted, indexed };
      } catch (err) {
        console.warn("Error in fetchBothForDate:", err);
        // Keep old data, set error state
        setError("SOMETHING_WENT_WRONG_TRY_LATER_OR_REFRESH");
        return { sorted: [] as HearingItem[], indexed: [] as HearingItem[] };
      } finally {
        setRefreshedAt(getLocalISOString());
        setLoading(false);
      }
    },
    [fetchHearings]
  );

  useEffect(() => {
    fetchBothForDate(selectedDate);
  }, [fetchBothForDate, selectedDate]);

  // Auto refresh: mimic DisplayBoard rules but without date picker
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let timeoutToStart: NodeJS.Timeout | null = null;
    let timeoutToNextDay: NodeJS.Timeout | null = null;

    const startAutoRefresh = () => {
      interval = setInterval(async () => {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const endMinutes = 17 * 60; // 5 PM
        const isPastFivePM = currentMinutes >= endMinutes;

        try {
          const { sorted } = await fetchBothForDate(selectedDate);
          const stillHasPending = sorted?.some((h) => h.status !== "COMPLETED");

          // stop auto-refresh if past 5 PM or all completed
          if (isPastFivePM || !stillHasPending) {
            if (interval) {
              clearInterval(interval);
              interval = null;
            }

            // if it's past 5:02:00 PM, schedule data fetch for next-day
            if (isPastFivePM) scheduleNextDayFetch();
          }
        } catch (e) {
          console.error("Auto refresh API error:", e);
        }
      }, updateInterval);
    };

    const triggerNextDayFetch = async () => {
      const now = new Date();
      now.setDate(now.getDate() + 1);
      const updatedSelectedDate = now.toISOString().split("T")[0];
      setSelectedDate(updatedSelectedDate);
      await fetchBothForDate(updatedSelectedDate);
    };

    const scheduleNextDayFetch = () => {
      const now = new Date();

      // Target = today 5:02:00 PM
      const target = new Date(now);
      target.setHours(17, 2, 0, 0);

      const diffMs = target.getTime() - now.getTime();

      // If it's already past 5:02:00 PM, do nothing (or could fetch by hard refresh if desired)
      if (diffMs <= 0) return;

      timeoutToNextDay = setTimeout(() => {
        triggerNextDayFetch();
      }, diffMs);
    };

    const init = () => {
      const now = new Date();
      const currentDateStr = now.toISOString().split("T")[0];
      const isToday = selectedDate === currentDateStr;
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const startMinutes = 11 * 60; // 11 AM
      const endMinutes = 17 * 60; // 5 PM

      const shouldStart = () =>
        sortedHearingsData?.some((h) => h.status !== "COMPLETED");

      // Only auto-refresh for today
      if (!isToday) return;

      if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
        if (shouldStart() || Boolean(error)) startAutoRefresh();
      } else if (
        currentMinutes < startMinutes &&
        (sortedHearingsData?.length > 0 || Boolean(error))
      ) {
        const diffMs = (startMinutes - currentMinutes) * 60 * 1000;
        timeoutToStart = setTimeout(() => startAutoRefresh(), diffMs);
      }
      scheduleNextDayFetch();
    };

    init();

    return () => {
      if (interval) clearInterval(interval);
      if (timeoutToStart) clearTimeout(timeoutToStart);
      if (timeoutToNextDay) clearTimeout(timeoutToNextDay);
    };
  }, [selectedDate, fetchBothForDate, sortedHearingsData, error]);

  // Page rotation for bottom list (uses the same updateInterval)
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentPage((prev) => {
        const total = Math.max(
          1,
          Math.ceil(Math.max(0, sortedHearingsData.length) / 12)
        );
        return total <= 1 ? 0 : (prev + 1) % total;
      });
    }, updateInterval);

    return () => clearInterval(id);
  }, [sortedHearingsData.length]);

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(Math.max(0, sortedHearingsData.length) / 12)
    );
    setCurrentPage((p) => (p >= totalPages ? totalPages - 1 : p));
  }, [sortedHearingsData.length]);

  // only show top 4 in progress and scheduled and passed over hearings.
  const inCompletedHearings = sortedHearingsData
    .slice(0, 4)
    .filter((h) =>
      ["IN_PROGRESS", "SCHEDULED", "PASSED_OVER"].includes(h?.status || "")
    );
  const totalBottomPages = Math.max(
    1,
    Math.ceil(Math.max(0, sortedHearingsData.length) / 12)
  );
  const pageStart = currentPage * 12;
  const currentBottom = indexedHearingsData.slice(pageStart, pageStart + 12);
  const leftCol = currentBottom.slice(0, 6);
  const rightCol = currentBottom.slice(6, 12);

  const advocates = useCallback((hearingItem: HearingItem) => {
    const parts: string[] = [];
    if (hearingItem?.advocate?.complainant?.length) {
      const count = hearingItem.advocate.complainant.length;
      const suffix =
        count === 2 ? " + 1 Other" : count > 2 ? ` + ${count - 1} others` : "";
      parts.push(`${hearingItem.advocate.complainant[0]} (C)${suffix}`);
    }
    if (hearingItem?.advocate?.accused?.length) {
      const count = hearingItem.advocate.accused.length;
      const suffix =
        count === 2 ? " + 1 Other" : count > 2 ? ` + ${count - 1} others` : "";
      parts.push(`${hearingItem.advocate.accused[0]} (A)${suffix}`);
    }
    return (
      <>
        {parts.map((p, i) => (
          <p
            key={i}
            className={`text-[clamp(17.76px,calc(1.11px+1.1327vw),22.2px)] leading-[clamp(20.8px,calc(1.3px+1.3265vw),26px)] ${i === 1 ? "pt-[clamp(6.4px,calc(0.4px+0.4082vw),8px)]" : ""}`}
          >
            {p}
          </p>
        ))}
      </>
    );
  }, []);

  const TopCard: React.FC<{ item: HearingItem; index: number }> = ({
    item,
    index,
  }) => (
    <div
      className={`flex font-roboto rounded-[4px] border border-[#E8E8E8] p-[clamp(12.8px,calc(0.8px+0.8163vw),16px)] gap-[clamp(6.4px,calc(0.4px+0.4082vw),8px)] ${getTopCardBackgroundColor(item.status || "")}`}
    >
      <div className={`text-[clamp(18px,calc(3px+1.0204vw),22px)] leading-[clamp(20.8px,calc(1.3px+1.3265vw),26px)] font-medium text-[#0A0A0A] pt-1`}>
        <span>{item?.serialNumber || ""}.</span>
      </div>
      <div className={`flex flex-col justify-between items-start gap-[clamp(11.768px,calc(0.74px+0.7505vw),14.71px)] w-[90%]`}>
        {/* Case name section */}
        <div className={`flex flex-col w-[100%] gap-[clamp(4.8px,calc(0.3px+0.3061vw),6px)]`}>
          <span className={`font-medium mr-1 text-[clamp(11.2px,calc(0.7px+0.7143vw),14px)] leading-[clamp(12.8px,calc(0.8px+0.8163vw),16px)] text-[#77787B]`}>
            {t("CASE_NAME")}
          </span>
          <span className={`leading-[clamp(20.8px,calc(1.3px+1.3265vw),26px)] font-bold text-[clamp(18px,calc(3px+1.0204vw),22px)] text-[#0A0A0A] truncate block w-full`}>
            {item.caseTitle || ""}
          </span>
        </div>

        {/* advocates section*/}
        <div className={`flex flex-col max-w-[100%] w-[100%] gap-[clamp(4.8px,calc(0.3px+0.3061vw),6px)]`}>
          <span className={`font-medium  mr-1 text-[clamp(11.2px,calc(0.7px+0.7143vw),14px)] leading-[clamp(12.8px,calc(0.8px+0.8163vw),16px)] text-[#77787B]`}>
            {t("ADVOCATES")}
          </span>
          <span className={`font-bold text-[clamp(18px,calc(3px+1.0204vw),22px)] text-[#0A0A0A]`}>
            {advocates(item)}
          </span>
        </div>

        {/* Case number section */}
        <div className={`flex flex-col w-[100%] gap-[clamp(4.8px,calc(0.3px+0.3061vw),6px)]`}>
          <span className={`font-medium mr-1 text-[clamp(11.2px,calc(0.7px+0.7143vw),14px)] leading-[clamp(12.8px,calc(0.8px+0.8163vw),16px)] text-[#77787B]`}>
            {t("CASE_NUMBER")}
          </span>
          <div className={`leading-[clamp(20.8px,calc(1.3px+1.3265vw),26px)] flex items-center justify-between flex-wrap`}>
            <span className={`font-bold text-[clamp(18px,calc(3px+1.0204vw),22px)] text-[#0A0A0A]`}>
              {item.caseNumber || "-"}
            </span>
            <span
              className={`px-[clamp(12.8px,calc(0.8px+0.8163vw),16px)] py-[clamp(3.2px,calc(0.2px+0.2041vw),4px)] rounded-full text-[clamp(15.2px,calc(0.95px+0.9694vw),19px)] font-medium ${getTopCardStatusTextBackgroundColor(index, item.status || "", inCompletedHearings, "style")} ${item.status === "IN_PROGRESS" || item.status === "SCHEDULED" ? "text-white" : ""}`}
            >
              {t(
                getTopCardStatusTextBackgroundColor(
                  index,
                  item.status || "",
                  inCompletedHearings,
                  "text"
                )
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const Row: React.FC<{
    item: HearingItem;
    serial: number;
    section: "left" | "right";
  }> = ({ item, serial }) => {
    const isInProgressOrScheduled =
      item?.status === "SCHEDULED" || item?.status === "IN_PROGRESS";

    const style = `${isInProgressOrScheduled ? (serial % 2 === 0 ? "bg-[#ECF3FD] border-[#E2E8F0] text-[#007E7E]" : "bg-[#007E7E] border-[#CBD5E1] text-white") : "bg-[#E8E8E8] border-[#CBD5E1] text-black"}`;
    const statusStyle = `${isInProgressOrScheduled ? "bg-[#9E400A] border-[0.5px] border-[#EA580C] text-white" : "bg-white text-black"}`;

    return (
      <div
        className={`grid grid-cols-[clamp(48px,calc(3px+3.0612vw),60px)_1.8fr_4fr_1.4fr] gap-x-[clamp(1.6px,calc(0.1px+0.1020vw),2px)] font-roboto font-medium text-[clamp(18px,calc(3px+1.0204vw),22px)] h-full`}
      >
        <div className={`pl-[clamp(8px,calc(0.5px+0.5102vw),10px)] h-full flex items-center ${style}`}>
          {serial}.
        </div>
        <div className={`pl-[clamp(8px,calc(0.5px+0.5102vw),10px)] h-full flex items-center truncate ${style}`}>
          {item.caseNumber || "-"}
        </div>
        <div className={`pl-[clamp(8px,calc(0.5px+0.5102vw),10px)] h-full flex items-center truncate ${style}`}>
          <span className="truncate block max-w-full">
            {item.caseTitle || "-"}
          </span>
        </div>
        <div className={`h-full flex items-center justify-center ${style}`}>
          <span
            className={`px-[clamp(12.8px,calc(0.8px+0.8163vw),16px)] py-[clamp(3.2px,calc(0.2px+0.2041vw),4px)] rounded-full text-[clamp(15.232px,calc(0.96px+0.9714vw),19.04px)] leading-[clamp(23.432px,calc(1.48px+1.4948vw),29.29px)] ${statusStyle}`}
          >
            {t(item.status || "")}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col max-w-full mx-auto px-[clamp(12.8px,calc(0.8px+0.8163vw),16px)] sm:px-6 py-[clamp(12.8px,calc(0.8px+0.8163vw),16px)] bg-white">
      <header className="w-full h-[73px] py-2 flex justify-between items-center  top-0 left-0 right-0 bg-white z-50">
        {/* <Link href="/" className="flex-shrink-0"> */}
        <div className="flex items-center gap-[clamp(12.8px,calc(0.8px+0.8163vw),16px)]">
          <Image
            src="/images/emblem.png"
            alt={t("EMBLEM")}
            width={123}
            height={73}
            className="h-[clamp(43.784px,calc(2.726px+2.7924vw),54.73px)] w-[clamp(26.4px,calc(1.65px+1.6837vw),33px)]"
          />
          <Image
            src="/images/logo.png"
            alt={t("ONCOURTS_LOGO")}
            width={123}
            height={73}
            className="h-[clamp(43.784px,calc(2.726px+2.7924vw),54.73px)] w-[clamp(72.8px,calc(4.54px+4.6439vw),91px)]"
          />
        </div>
        {/* Date + case schedule */}
        {leftCol?.length > 0 && (
          <div className="flex items-center justify-between mb-[clamp(9.6px,calc(0.6px+0.6122vw),12px)]">
            <div className="flex items-center gap-[clamp(6.4px,calc(0.4px+0.4082vw),8px)]">
              <span className="">
                <svgIcons.RefreshIcon2 />
              </span>
              <span className="font-roboto italic font-medium text-[clamp(19.2px,calc(1.2px+1.2245vw),24px)]">{`${t("Last refreshed")} ${calculateLastRefreshDay(refreshedAt)}`}</span>
            </div>
          </div>
        )}

        {/* </Link> */}
      </header>

      {/* Date + case schedule */}
      <div className="flex items-center justify-center mb-[clamp(9.6px,calc(0.6px+0.6122vw),12px)]">
        <div className="flex items-center gap-[clamp(12.8px,calc(0.8px+0.8163vw),16px)] text-[#007E7E] border-b-[2px] border-[#F7F5F3] ">
          <h2 className="text-left text-[clamp(25.6px,calc(1.6px+1.6327vw),32px)] 3xl:text-[169.22px] font-roboto font-medium">
            {t("24X7_ON_COURTS_CAUSELIST")}
          </h2>
          <span className="text-[clamp(17.6px,calc(1.1px+1.1224vw),22px)] font-roboto font-bold">|</span>
          <span className="text-[clamp(25.6px,calc(1.6px+1.6327vw),32px)] font-roboto font-medium">
            {formattedDateDisplay(selectedDate)}
          </span>
        </div>
      </div>
      {/* Top four big boxes */}
      {sortedHearingsData.length === 0 ? (
        loading ? (
          <div className="flex justify-center items-center text-[#DC2626] font-roboto font-medium text-[clamp(14.4px,calc(0.9px+0.9184vw),18px)]">
            {t("COMMON_LOADING")}
          </div>
        ) : (
          <div className="h-[27vh] flex justify-center items-center text-[#DC2626] font-roboto font-medium text-[clamp(35.2px,calc(2.2px+2.2449vw),44px)]">
            {t("NO_CASE_SCHEDULED_FOR_THE_DAY")}
          </div>
        )
      ) : sortedHearingsData?.length > 0 && inCompletedHearings.length === 0 ? (
        <div className="h-[27vh] flex justify-center items-center text-black font-roboto font-medium text-[clamp(35.2px,calc(2.2px+2.2449vw),44px)]">
          {t("ALL_HEARINGS_FOR_THE_DAY_HAVE_BEEN_COMPLETED")}
        </div>
      ) : (
        <div className={`grid gap-[clamp(12.8px,calc(0.8px+0.8163vw),16px)] grid-cols-4`}>
          {inCompletedHearings.map((item, idx) => (
            <TopCard
              key={`${item.caseNumber}-${idx}`}
              item={item}
              index={idx}
            />
          ))}
        </div>
      )}

      {/* Divider */}
      {leftCol?.length > 0 && (
        <div className="my-3 -mx-6 border-t-[1px] border-[#E8E8E8]" />
      )}

      {/* Bottom paginated section: 12 per page, split 6/6 */}
      {leftCol?.length > 0 && (
        <div className="rounded flex flex-col flex-1">
          {/* headers for both columns */}
          <div
            className="grid grid-cols-2 gap-x-[clamp(15.688px,calc(0.981px+1.0005vw),19.61px)] text-[#0A0A0A] font-roboto text-[clamp(19.2px,calc(1.2px+1.2245vw),24px)]"
            style={{ position: "sticky", top: 0 }}
          >
            <div className="grid grid-cols-[clamp(48px,calc(3px+3.0612vw),60px)_1.8fr_4fr_1.4fr] gap-x-[clamp(1.6px,calc(0.1px+0.1020vw),2px)] items-center mb-[clamp(4px,calc(0.25px+0.2551vw),5px)]">
              <span className="bg-[#F7F5F3] py-[clamp(6.4px,calc(0.4px+0.4082vw),8px)] pl-[clamp(4px,calc(0.25px+0.2551vw),5px)]">{t("S_NO")}</span>
              <span className="bg-[#F7F5F3] py-[clamp(6.4px,calc(0.4px+0.4082vw),8px)] pl-[clamp(8px,calc(0.5px+0.5102vw),10px)] truncate">
                {t("CASE_NUMBER")}
              </span>
              <span className="bg-[#F7F5F3] py-[clamp(6.4px,calc(0.4px+0.4082vw),8px)] pl-[clamp(8px,calc(0.5px+0.5102vw),10px)]">
                {t("CASE_NAME")}
              </span>
              <span className="bg-[#F7F5F3] text-center py-[clamp(6.4px,calc(0.4px+0.4082vw),8px)]">
                {t("HEARING_STATUS")}
              </span>
            </div>
            {rightCol?.length > 0 && (
              <div className="grid grid-cols-[clamp(48px,calc(3px+3.0612vw),60px)_1.8fr_4fr_1.4fr] gap-x-[clamp(1.6px,calc(0.1px+0.1020vw),2px)] items-center mb-[clamp(4px,calc(0.25px+0.2551vw),5px)]">
                <span className="bg-[#F7F5F3] py-[clamp(6.4px,calc(0.4px+0.4082vw),8px)] pl-[clamp(4px,calc(0.25px+0.2551vw),5px)]">{t("S_NO")}</span>
                <span className="bg-[#F7F5F3] py-[clamp(6.4px,calc(0.4px+0.4082vw),8px)] pl-[clamp(8px,calc(0.5px+0.5102vw),10px)] truncate">
                  {t("CASE_NUMBER")}
                </span>
                <span className="bg-[#F7F5F3] py-[clamp(6.4px,calc(0.4px+0.4082vw),8px)] pl-[clamp(8px,calc(0.5px+0.5102vw),10px)]">
                  {t("CASE_NAME")}
                </span>
                <span className="bg-[#F7F5F3] text-center py-[clamp(6.4px,calc(0.4px+0.4082vw),8px)]">
                  {t("HEARING_STATUS")}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 grid grid-cols-2 gap-x-[clamp(15.688px,calc(0.981px+1.0005vw),19.61px)]">
            {/* Left 6 */}
            <div className="grid grid-rows-6 h-full gap-y-[clamp(4px,calc(0.25px+0.2551vw),5px)]">
              {leftCol.map((item, i) => {
                return (
                  <Row
                    key={`${item?.caseNumber}-${i}`}
                    item={item}
                    serial={item?.serialNumber ?? pageStart + i + 1}
                    section="left"
                  />
                );
              })}
            </div>
            {/* Right 6 */}
            <div className="grid grid-rows-6 h-full gap-y-[clamp(4px,calc(0.25px+0.2551vw),5px)]">
              {rightCol.map((item, i) => (
                <Row
                  key={`${item?.caseNumber}-${i}`}
                  item={item}
                  serial={item?.serialNumber ?? pageStart + 6 + i + 1}
                  section="right"
                />
              ))}
            </div>
          </div>

          {/* Footer page indicator */}
          <div className="flex items-center gap-[clamp(12.8px,calc(0.8px+0.8163vw),16px)] py-[clamp(12.8px,calc(0.8px+0.8163vw),16px)] font-roboto text-[clamp(19.2px,calc(1.2px+1.2245vw),24px)]">
            <span className="h-px bg-[#E8E8E8] flex-1" aria-hidden="true" />
            <span className="whitespace-nowrap font-medium">
              {t("PAGE")} {totalBottomPages === 0 ? 0 : currentPage + 1} :{" "}
              {indexedHearingsData.length === 0 ? 0 : pageStart + 1}-
              {Math.min(
                pageStart + currentBottom.length,
                indexedHearingsData.length
              )}{" "}
              {t("OF")} {indexedHearingsData.length}
            </span>
            <span className="h-px bg-[#E8E8E8] flex-1" aria-hidden="true" />
          </div>
        </div>
      )}
    </div>
  );
}
