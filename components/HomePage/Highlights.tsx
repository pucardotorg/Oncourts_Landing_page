import React, { useEffect, useState } from "react";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { svgIcons } from "../../data/svgIcons";
import { transformImpactGlance } from "../../TransformData/transformResponseData";

interface HighlightItemProps {
  value: string;
  label: string;
}

export interface DashboardMetricsNew {
  id: string;
  numberOfCasesFiled: number;
  numberOfCasesDisposed: number;
  daysToCaseRegistration: number;
  averageNumberOfDaysBetweenHearingsForCase: number;
}

const HighlightItem: React.FC<HighlightItemProps> = ({ value, label }) => (
  <div className="flex flex-col items-center justify-center px-4 py-6 text-center">
    <span className="font-noto font-bold text-[72.28px] leading-[78.3px] tracking-[-2.41px] text-center text-[#0F766E]">
      {value}
    </span>
    <span className="font-sans font-medium text-[16px] leading-[24px] tracking-[0.01em] text-center text-[[#0F172A]]">
      {label}
    </span>
  </div>
);

const Highlights: React.FC = () => {
  const { t } = useSafeTranslation();
  const [stats, setStats] = useState<DashboardMetricsNew>();

  useEffect(() => {
    const fetchImpactGlance = async () => {
      try {
        const res = await fetch("/api/impactGlance");
        const data = await res.json();
        console.log("data", data);

        const transformed = transformImpactGlance(data);
        setStats(transformed?.stats || []);
      } catch (error) {
        console.error("Failed to fetch Whats New data", error);
      }
    };

    fetchImpactGlance();
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
      value: stats?.daysToCaseRegistration?.toString() || "",
      label: t("DAYS_TO_NEXT_HEARING"),
    },
    {
      value: stats?.averageNumberOfDaysBetweenHearingsForCase?.toString() || "",
      label: t("DAYS_TO_CASE_REGISTRATION"),
    },
  ];

  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-[1440px] mx-auto px-6">
        <h2 className="font-libre font-normal text-[48px] leading-[56px] tracking-normal text-center align-middle text-[#3A3A3A]">
          {t("HIGHLIGHTS")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, index) => (
            <HighlightItem key={index} value={item.value} label={item.label} />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button
            className="flex justify-center items-center w-[376px] h-[69px] px-8 border border-[#0F766E] rounded-xl gap-3"
            onClick={() => window.open("/dashboard", "_blank")}
          >
            <svgIcons.openInNewTabIcon />
            <span className="font-sans font-medium text-[16px] leading-[24px] tracking-[0.01em] text-center text-[#0F766E]">
              {t("VIEW_DETAILED_DASHBOARD")}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Highlights;
