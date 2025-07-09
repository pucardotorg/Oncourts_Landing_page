import React, { useState } from "react";
import { format } from "date-fns";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { svgIcons } from "../../data/svgIcons";

interface CauseListDisplayProps {
  date: string;
  pdfUrl: string | null;
  onDownload: () => void;
}

function CauseListDisplay({ date, pdfUrl, onDownload }: CauseListDisplayProps) {
  const [showPreview, setShowPreview] = useState(false);
  const formattedDate = format(new Date(date), "dd/MM/yyyy");

  return (
    <>
      {showPreview && pdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Cause List - {formattedDate}
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
            <div className="flex-1 p-4">
              <iframe
                src={`${pdfUrl}#toolbar=0`}
                className="w-full h-full rounded border-2 border-gray-200"
                title={`Cause List Preview - ${formattedDate}`}
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center w-full max-w-[416px] bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="w-full aspect-[1.64] relative bg-white">
          {pdfUrl ? (
            <>
              <iframe
                src={`${pdfUrl}#toolbar=0&view=FitH`}
                className="w-full h-full absolute inset-0"
                title={`Cause List ${formattedDate}`}
              />
              <button
                onClick={() => setShowPreview(true)}
                className="absolute bottom-4 right-4 z-10"
              >
                <svgIcons.PreviewIcon />
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-[#DC2626]">
              Hearing not scheduled for this date
            </div>
          )}
        </div>
        <div className="flex items-center justify-between w-full py-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0">
              <svgIcons.SmallFileIcon />
            </span>
            <span className="font-roboto font-medium text-[20px] leading-[24px] tracking-[-0.2px] text-[#334155] truncate max-w-[300px]">
              {`${formattedDate}${pdfUrl ? "_causelist.pdf" : ""}`}
            </span>
          </div>
          {pdfUrl && (
            <button
              onClick={onDownload}
              className="flex-shrink-0 text-teal-600 hover:text-teal-700 p-2 rounded-full hover:bg-teal-50 transition-colors"
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
