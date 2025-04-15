import React, { useRef, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { svgIcons } from "../../data/svgIcons";
import styles from "../../styles/WhatsNewCard.module.css";

interface CaseItem {
  id: string;
  title: string;
  date: Date;
  fileUrl: string;
  isPriority?: boolean;
}

interface NoticeItem {
  id: string;
  title: string;
  date: Date;
  description: string;
  fileUrl: string;
  isPriority?: boolean;
}

interface CourtListingSectionProps {
  caseItems: CaseItem[];
  noticeItems: NoticeItem[];
}

const CourtListingSection: React.FC<CourtListingSectionProps> = ({
  caseItems,
  noticeItems,
}) => {
  const [searchDate, setSearchDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;
  const dateInputRef = useRef<HTMLInputElement>(null);

  const maxNoticePages = Math.ceil(noticeItems.length / itemsPerPage);
  const displayedNotices = noticeItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (date: Date): string => {
    return format(date, "dd MMM yyyy");
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDate(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex justify-center">
      <div className="flex space-x-8 p-8 w-[95%]">
        <div className="w-[48%] space-y-4">
          <div>
            <div className="flex items-center mb-6 text-xl">
              <div className="bg-teal text-white px-3 py-1 shadow-md shadow-gray-400 font-raleway ">
                <span className="font-medium">Cause</span>
              </div>
              <div className="ml-2 font-medium">List</div>
            </div>
            <p className="text-gray-700 mb-6 font-raleway text-lg font-normal">
              Cause list for the next day will be available on the website after
              5 PM.
            </p>
          </div>

          <div className="mb-6 pt-4">
            <label className="block mb-2 text-gray-700 font-raleway font-medium">
              Search by Date
            </label>
            <div className="relative w-[90%] border-b border-gray-300 flex items-center">
              <input
                ref={dateInputRef}
                type="date"
                value={searchDate}
                onChange={handleDateChange}
                className={`${styles.customDateInput} w-full py-2 pr-10 text-gray-700 focus:outline-none appearance-none`}
              />
              <div
                className="absolute right-2 text-teal cursor-pointer"
                onClick={() => {
                  if (dateInputRef.current) {
                    dateInputRef.current.showPicker?.();
                    dateInputRef.current.focus();
                  }
                }}
              >
                <svgIcons.CalanderIcon />
              </div>
            </div>
          </div>

          <div className="space-y-4 relative w-[90%] pt-4">
            {caseItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border rounded p-4"
              >
                <div className="flex items-center font-raleway text-lg">
                  <a
                    href="#"
                    className="text-gray-700 hover:text-teal-600 font-semibold underline"
                  >
                    {item.title}
                  </a>
                </div>
                <a
                  href={item.fileUrl}
                  className="bg-teal text-white px-3 py-1 rounded flex items-center text-sm underline w-[125px] justify-center"
                  download
                >
                  <span>Download</span>
                  <svgIcons.DownloadIcon />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[2px] bg-gray-300"></div>

        <div className="w-[48%] mb-2 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center mb-6 text-xl">
              <div className="bg-teal text-white px-3 py-1 shadow-md shadow-gray-400 font-raleway">
                <span className="font-medium">Notice</span>
              </div>
              <div className="ml-2 font-medium">Board</div>
            </div>
            <div className="bg-white border border-teal px-8 py-2 rounded-md">
              <Link href="/notice-board" className="text-teal font-semibold">
                View All
              </Link>
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-2 gap-6">
              {displayedNotices.map((notice) => (
                <div key={notice.id} className="pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 flex items-center me-1">
                        <svgIcons.CalanderIcon />
                      </div>
                      <span className="text-gray-500 text-sm">
                        Date: {formatDate(notice.date)}
                      </span>
                    </div>
                    <a
                      href={notice.fileUrl}
                      className="text-grey-600 hover:underline flex items-center text-sm"
                      download
                    >
                      <span className="underline">Download</span>
                      <svgIcons.DownloadIcon />
                    </a>
                  </div>

                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    {notice.title}
                  </h3>
                  <p className="text-gray-600 text-md">{notice.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-auto pt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded mr-2 text-gray-600 disabled:opacity-50"
            >
              ← Prev
            </button>

            {Array.from({ length: maxNoticePages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 border rounded mx-1 ${
                    page === currentPage
                      ? "bg-teal text-white"
                      : "text-gray-600"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === maxNoticePages}
              className="px-3 py-1 border rounded ml-2 text-gray-600 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtListingSection;
