import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { svgIcons } from "../../data/svgIcons";
import PdfPreview from "../Utils/PdfPreview";
import { useMediaQuery } from "@mui/material";

interface CauseListDisplayProps {
  date: string;
  pdfUrl: string | null;
  onDownload: () => void;
  t: (key: string) => string;
}

function CauseListDisplay({
  date,
  pdfUrl,
  onDownload,
  t,
}: CauseListDisplayProps) {
  const [showPreview, setShowPreview] = useState(false);
  const formattedDate = format(new Date(date), "dd/MM/yyyy");
  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    if (showPreview) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showPreview]);

  return (
    <>
      {showPreview && pdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div
            className={`bg-white rounded-lg  flex flex-col ${isMobile ? "h-[95%] w-[95%]" : "h-[90vh] w-[70%]"}`}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900 font-roboto">
                {t("CAUSE_LIST_DISPLAY_TITLE_WITH_DATE")} {formattedDate}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onDownload}
                  className="text-teal-600 hover:text-teal-700 p-2 rounded-full hover:bg-teal-50 transition-colors"
                  title="Download"
                >
                  <svgIcons.SmallDownloadIcon />
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Close"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable preview area */}
            <div className="flex-1 overflow-y-hidden p-4">
              <PdfPreview
                fileUrl={pdfUrl}
                width={isMobile ? "80%" : "65%"}
                height={isMobile ? "80%" : "80%"}
                scrollable={true}
              />
            </div>
          </div>
        </div>
      )}

      <div
        className={`flex flex-col items-center bg-white overflow-hidden ${isMobile ? "h-[253px] w-[95%]" : "w-[436px] h-[253px]"}`}
      >
        <div className=" h-[194px] p-2 aspect-[1.64] relative bg-white w-[100%] border border-[#E2E8F0] rounded-[4px]">
          {pdfUrl ? (
            <>
              <PdfPreview
                fileUrl={pdfUrl}
                height={"178px"}
                width={isMobile ? "90%" : "436px"}
                scrollable={false}
              />
              <button
                onClick={() => setShowPreview(true)}
                className={`absolute bottom-3 z-10 right-3 `}
              >
                <svgIcons.PreviewIcon />
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-[#DC2626]">
              {t("HEARING_NOT_SCHEDULED_FOR_THIS_DATE")}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between w-full py-3 border-t border-gray-100 bg-[#F0FDFA]">
          <div className="flex items-center gap-2 h-[42px]">
            <span className="flex-shrink-0">
              <svgIcons.SmallFileIcon />
            </span>
            <span className="font-roboto font-medium text-[20px] leading-[24px] tracking-[-0.2px] text-[#334155] truncate max-w-[300px]">
              {`${formattedDate}`} 
              {/* ${pdfUrl ? "_causelist.pdf" : ""}`} */}
            </span>
          </div>
          {pdfUrl && (
            <button
              onClick={onDownload}
              className={`flex-shrink-0 text-teal-600 hover:text-teal-700 p-2  flex items-center justify-center bg-[white] px-[12px] border border-[#E2E8F0] hover:bg-teal-50 transition-colors ${isMobile ? "rounded-[12px]" : "rounded-[4px]"}`}
            >
              <svgIcons.SmallDownloadIcon />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default CauseListDisplay;
