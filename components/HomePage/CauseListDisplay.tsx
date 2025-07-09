import React, { useState } from "react";
import { format } from "date-fns";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { svgIcons } from "../../data/svgIcons";

interface CauseListDisplayProps {
  date: string;
  pdfUrl: string | null;
  onDownload: () => void;
}

const CauseListDisplay: React.FC<CauseListDisplayProps> = ({
  date,
  pdfUrl,
  onDownload,
}) => {
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
                  {/* <ArrowDownTrayIcon className="w-5 h-5" /> */}
                  <svgIcons.downloadIcon2 />
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
      <div className="bg-white rounded-lg shadow-sm p-6 h-[300px] flex flex-col relative">
        <div className="flex-1 flex items-center justify-center">
          {pdfUrl ? (
            <>
              <div className="relative w-full h-full">
                <iframe
                  src={`${pdfUrl}#toolbar=0`}
                  className="w-full h-full"
                  title={`Cause List ${formattedDate}`}
                />
                <button
                  onClick={() => setShowPreview(true)}
                  className="absolute bottom-4 right-4"
                >
                  <svgIcons.previewIcon />
                </button>
              </div>
            </>
          ) : (
            <div className="text-red-500 text-center">
              Hearing not scheduled for this date
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">{formattedDate}</span>
            {pdfUrl && <span className="text-gray-500">_causelist.pdf</span>}
          </div>
          {pdfUrl && (
            <button
              onClick={onDownload}
              className="text-teal-600 hover:text-teal-700 p-2 rounded-full hover:bg-teal-50 transition-colors"
            >
              <svgIcons.downloadIcon2 />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CauseListDisplay;
