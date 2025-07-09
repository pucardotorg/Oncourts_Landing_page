import React, { useEffect, useState, useCallback } from "react";
import { format, subDays, addDays } from "date-fns";
// import { InformationCircleIcon } from '@heroicons/react/24/outline';
import CauseListDisplay from "./CauseListDisplay";
import { svgIcons } from "../../data/svgIcons";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

interface CauseListState {
  date: string;
  pdfUrl: string | null;
}

const HomeCauseLists: React.FC = () => {
  const [leftCauseList, setLeftCauseList] = useState<CauseListState | null>(
    null
  );
  const [rightCauseList, setRightCauseList] = useState<CauseListState | null>(
    null
  );
  const tenantId = localStorage.getItem("tenant-id") || "kl";
  const { t } = useSafeTranslation();

  const fetchPdf = useCallback(async (date: string): Promise<string | null> => {
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
            searchDate: date,
          },
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || `HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error fetching PDF:", error);
      return null;
    }
  }, []);

  const downloadPdf = useCallback(async (date: string) => {
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
            searchDate: date,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${format(new Date(date), "dd-MM-yyyy")}_causelist.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download cause list");
    }
  }, []);

  const updateCauseLists = useCallback(async () => {
    const now = new Date();
    const today = format(now, "yyyy-MM-dd");
    const isPastFivePM = now.getHours() >= 17;

    let leftDate: string;
    let rightDate: string;

    if (isPastFivePM) {
      leftDate = today;
      rightDate = format(addDays(now, 1), "yyyy-MM-dd");
    } else {
      leftDate = format(subDays(now, 1), "yyyy-MM-dd");
      rightDate = today;
    }

    const [leftPdfUrl, rightPdfUrl] = await Promise.all([
      fetchPdf(leftDate),
      fetchPdf(rightDate),
    ]);

    setLeftCauseList({ date: leftDate, pdfUrl: leftPdfUrl });
    setRightCauseList({ date: rightDate, pdfUrl: rightPdfUrl });
  }, [fetchPdf]);

  useEffect(() => {
    updateCauseLists();
  }, [updateCauseLists]);

  // Cleanup effect for object URLs
  useEffect(() => {
    return () => {
      if (leftCauseList?.pdfUrl) URL.revokeObjectURL(leftCauseList.pdfUrl);
      if (rightCauseList?.pdfUrl) URL.revokeObjectURL(rightCauseList.pdfUrl);
    };
  }, [leftCauseList?.pdfUrl, rightCauseList?.pdfUrl]);

  return (
    <div className="bg-[#F8FAFC] py-12">
      <div className="container mx-auto px-4">
        <h2 className="flex mb-12 items-center justify-center text-center font-libre font-normal text-[40px] leading-[48px] text-[#3A3A3A]">
          Cause List
        </h2>
        <div className="flex center justify-center gap-[60px]">
          {leftCauseList && (
            <CauseListDisplay
              date={leftCauseList.date}
              pdfUrl={leftCauseList.pdfUrl}
              onDownload={() => downloadPdf(leftCauseList.date)}
            />
          )}
          {rightCauseList && (
            <CauseListDisplay
              date={rightCauseList.date}
              pdfUrl={rightCauseList.pdfUrl}
              onDownload={() => downloadPdf(rightCauseList.date)}
            />
          )}
        </div>
        <div className="flex items-center justify-center mt-8 gap-2">
          {/* <InformationCircleIcon className="w-5 h-5 text-teal-700" /> */}
          <svgIcons.infoIcon />
          <p className="font-roboto font-normal text-[20px] leading-[26px] tracking-[-0.2px] text-[#334155]">
            Cause list for the next day will be available after{" "}
            <strong>05:00 PM</strong>
          </p>
        </div>
        <div className="flex justify-center mt-8">
          <button
            className="flex flex-row items-center justify-center px-4 md:px-[16px] gap-[12px] w-[311px] h-[69px] bg-white border border-[#0F766E] rounded-[12px] shadow-[inset_-2px_-2px_2px_rgba(15,23,42,0.14),inset_2px_2px_2px_1px_rgba(255,255,255,0.9)]"
            onClick={() => window.open("/", "_blank")}
          >
            <svgIcons.openInNewTabIcon />
            <span className="w-[296px] h-[32px] font-roboto font-medium text-[28px] leading-[32px] tracking-[-0.56px] text-center text-[#0F766E]">
              {t("View Display Board")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeCauseLists;
