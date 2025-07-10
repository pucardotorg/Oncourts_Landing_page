import React from "react";
import { svgIcons } from "../../data/svgIcons";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { getStatusStyle } from "../../pages/display-board";

interface CaseData {
  caseNumber?: string;
  caseTitle?: string;
  purpose?: string;
  status?: string;
  advocates?: JSX.Element;
}

interface ExpandableCardV2Props {
  caseData: CaseData;
  onViewDetails: () => void;
}

const ExpandableCardV2: React.FC<ExpandableCardV2Props> = ({ caseData }) => {
  const { t } = useSafeTranslation();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const statusColor = getStatusStyle(caseData.status || "");

  return (
    <div
      className={`border-b  border-[#E2E8F0] px-0 mt-0 ${isExpanded ? "" : "border-l border-r"}`}
    >
      <div
        className={`flex justify-between items-center px-[5px] cursor-pointer h-[41px] ${isExpanded ? "bg-[#F0FDFA]" : ""}`}
        onClick={toggleExpand}
      >
        <div className="flex flex-row">
          <div className="flex justify-between items-center">
            <span className="h-[21px] font-roboto font-normal text-[14.07px] leading-[20px] text-[#334155] w-[40vw]">
              {caseData.caseNumber}
            </span>
            <span
              className={`flex flex-row justify-center items-center p-[8.22px] gap-[4.11px] h-[20.55px] rounded-[4.19px] ${statusColor}`}
            >
              <h2
                className={`px-3 py-1 rounded-full font-medium font-roboto text-[13.36px] leading-[21px]`}
              >
                {t(caseData.status || "")}
              </h2>
            </span>
          </div>
        </div>
        <button className="py-2 px-[5px] border-l border-[#E2E8F0] h-[41px]">
          {isExpanded ? (
            <svgIcons.UpArrowIcon fill="#334155" width="16" />
          ) : (
            <svgIcons.DownArrowIcon fill="#334155" width="16" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div
          className={`border-t border-[#E2E8F0] py-4 px-[5px] space-y-4 w-full ${isExpanded ? "border-l border-r" : ""}`}
        >
          <div className="flex flex-col justify-center items-center w-full gap-4">
            <div className="flex flex-row justify-between w-full items-center">
              <div className="font-roboto font-semibold text-[14.07px] leading-[20px] text-[#0F172A] min-w-[40vw]">
                {t("CASE_TITLE")}:
              </div>
              <div className="w-full flex flex-row justify-left items-center">
                <div className="text-[14.07px] leading-[20px] text-[#334155]">
                  {caseData.caseTitle || ""}
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between w-full items-center">
              <div className="font-roboto font-semibold text-[14.07px] leading-[20px] text-[#0F172A] min-w-[40vw]">
                {t("PURPOSE")}:
              </div>
              <div className="w-full flex flex-row justify-left items-center">
                <div className="text-[14.07px] leading-[20px] text-[#334155]">
                  {t(caseData.purpose || "")}
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between w-full items-center">
              <div className="font-roboto font-semibold text-[14.07px] leading-[20px] text-[#0F172A] min-w-[40vw]">
                {t("ADVOCATE")}:
              </div>
              <div className="w-full flex flex-row justify-left items-center">
                <div className="text-[14.07px] leading-[20px] text-[#334155]">
                  {caseData?.advocates || ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableCardV2;
