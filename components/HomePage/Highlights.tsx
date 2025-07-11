import React, { useEffect, useState } from "react";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { svgIcons } from "../../data/svgIcons";
import { transformImpactGlance } from "../../TransformData/transformResponseData";
import { useMediaQuery } from "@mui/material";

interface HighlightItemProps {
  value: string;
  label: string;
  isMobile?: boolean;
}

export interface DashboardMetricsNew {
  id: string;
  numberOfCasesFiled: number;
  numberOfCasesDisposed: number;
  daysToCaseRegistration: number;
  averageNumberOfDaysBetweenHearingsForCase: number;
}

const HighlightItem: React.FC<HighlightItemProps> = ({
  value,
  label,
  isMobile = false,
}) => (
  <div className="flex flex-col items-center justify-center px-4 text-center">
    <span
      className={`font-noto font-bold tracking-[-2.41px] text-center text-[#0F766E] self-stretch ${isMobile ? "text-[48px] leading-[78px]" : "text-[72.2755px] leading-[78px]"}`}
    >
      {value || "\u00A0"}
    </span>
    <span
      className={`font-roboto font-medium tracking-[-0.26px] text-center mt-4 text-[#0F172A] ${isMobile ? "text-[20px] leading-[24px]" : "text-[26px] leading-[30px]"}`}
    >
      {label}
    </span>
  </div>
);

const Highlights: React.FC = () => {
  const { t } = useSafeTranslation();
  const [stats, setStats] = useState<DashboardMetricsNew>();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const fetchImpactGlance = async () => {
    try {
      const res = await fetch("/api/impactGlance");
      const data = await res.json();

      const transformed = transformImpactGlance(data);
      setStats(transformed?.stats || []);
    } catch (error) {
      console.error("Failed to fetch Whats New data", error);
    }
  };

  const calculateTimeUntilRefresh = () => {
    const now = new Date();
    const targetTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      17,
      0,
      45
    );

    // If current time is past today's target time, set target to tomorrow
    if (now > targetTime) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    return targetTime.getTime() - now.getTime();
  };

  useEffect(() => {
    // Initial fetch
    fetchImpactGlance();

    // Set up refresh timer
    const timeUntilRefresh = calculateTimeUntilRefresh();
    console.log(
      `[Highlights] Setting refresh timer for ${timeUntilRefresh}ms (${new Date(Date.now() + timeUntilRefresh).toLocaleString()})`
    );

    const refreshTimer = setTimeout(() => {
      fetchImpactGlance();
      // After the refresh, set up the next day's timer
      const nextDayTimer = setTimeout(() => {
        window.location.reload(); // Force a full reload to reset all timers
      }, calculateTimeUntilRefresh());
      return () => clearTimeout(nextDayTimer);
    }, timeUntilRefresh);

    return () => clearTimeout(refreshTimer);
  }, []);

  const highlights = [
    {
      value: stats?.numberOfCasesFiled?.toString() || "",
      label: t("CASES_FILED"),
    },
    {
      value: stats?.numberOfCasesDisposed?.toString() || "",
      label: t("CASES_DISPOSED"),
    },
    {
      value: stats?.averageNumberOfDaysBetweenHearingsForCase?.toString() || "",
      label: t("DAYS_TO_NEXT_HEARING"),
    },
  ];

  return (
    <section className={`w-full bg-white ${isMobile ? "py-4" : "py-16"}`}>
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex items-center justify-center mb-8">
          <h2
            className={`px-12 pb-2 font-libre font-normal  tracking-normal text-center align-middle text-[#3A3A3A] border-b border-[#CBD5E1] ${isMobile ? "text-[32px] leading-[40px] w-[90%]" : "text-[40px] leading-[48px]"}`}
          >
            {t("HIGHLIGHTS")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item, index) => (
            <HighlightItem
              key={index}
              value={item.value}
              label={item.label}
              isMobile={isMobile}
            />
          ))}
        </div>
        <div className={`flex justify-center ${isMobile ? "mt-6" : "mt-12"}`}>
          <button
            className={`flex flex-row items-center justify-center px-4 md:px-[16px] gap-[12px] bg-white border border-[#0F766E] rounded-[12px] ${isMobile ? "h-[40px]" : "h-[69px]"}`}
            onClick={() => window.open("/", "_blank")}
          >
            <svgIcons.OpenInNewTabIcon width={isMobile ? "16" : "30"} />
            <span
              className={`h-[32px] font-roboto font-medium leading-[32px] tracking-[-0.56px] text-center text-[#0F766E] ${isMobile ? "text-[16px]" : "text-[28px]"}`}
            >
              {t("VIEW_DETAILED_DASHBOARD")}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Highlights;
