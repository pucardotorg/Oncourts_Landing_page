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
    <span className="font-noto font-bold text-[72.28px] h-[78.3px] leading-[78.3px] tracking-[-2.41px] text-center text-[#0F766E]">
      {value || "\u00A0"}
    </span>
    <span className="h-[30px] font-roboto font-medium text-[26px] leading-[30px] tracking-[-0.26px] text-center text-[#0F172A]">
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
      value: stats?.averageNumberOfDaysBetweenHearingsForCase?.toString() || "",
      label: t("DAYS_TO_NEXT_HEARING"),
    },
    {
      value: stats?.daysToCaseRegistration?.toString() || "",
      label: t("DAYS_TO_CASE_REGISTRATION"),
    },
  ];

  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-[1440px] mx-auto px-6">
        <h2 className="font-libre h-[48px] font-[400] text-[40px] leading-[48px] tracking-normal text-center align-middle text-[#3A3A3A]">
          {t("HIGHLIGHTS")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, index) => (
            <HighlightItem key={index} value={item.value} label={item.label} />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button
            className="flex flex-row items-center justify-center px-4 md:px-[16px] gap-[12px] w-[376px] h-[69px] bg-white border border-[#0F766E] rounded-[12px] shadow-[inset_-2px_-2px_2px_rgba(15,23,42,0.14),inset_2px_2px_2px_1px_rgba(255,255,255,0.9)]"
            onClick={() => window.open("/", "_blank")}
          >
            <svgIcons.OpenInNewTabIcon />
            <span className="w-[296px] h-[32px] font-roboto font-medium text-[28px] leading-[32px] tracking-[-0.56px] text-center text-[#0F766E]">
              {t("VIEW_DETAILED_DASHBOARD")}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Highlights;
