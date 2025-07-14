import React, { useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";
import { commonStyles } from "../../styles/commonStyles";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import SectionHeading from "../../components/common/SectionHeading";
import { FiDownload, FiSearch, FiRefreshCw } from "react-icons/fi";
import Pagination from "../../components/Utils/Pagination";
import { useMediaQuery } from "@mui/material";
import { formatDate } from "../../utils/formatDate";

// Define the Notice type
interface Notice {
  title?: string;
  publishedDate?: string;
  fileStoreId?: string;
  tenantId?: string;
  type?: string;
  language?: string;
  validTill?: string;
  noticeNumber?: string;
  createdBy?: string;
  createdTime?: string;
  lastModifiedBy?: string;
  lastModifiedTime?: string;
}

const Notices: React.FC = () => {
  const { t } = useSafeTranslation();
  const initialLoadRef = useRef<boolean>(false);
  const [offset, setOffset] = useState(0);
  const limit = 50;
  const [totalCount, setTotalCount] = useState(0);
  const [noticesList, setNoticesList] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const tenantId = localStorage.getItem("tenant-id") || "kl";
  const [searchText, setSearchText] = useState("");
  const isMobile = useMediaQuery("(max-width:640px)");

  const searchNotices = useCallback(
    async (offsetOverride: number, searchTextOverride: string) => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/search-notices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            searchText: searchTextOverride,
            limit,
            offset: offsetOverride,
            tenantId,
          }),
        });

        const data = await response.json();

        if (data && data.LandingPageNotices) {
          setNoticesList(data.LandingPageNotices);
          setTotalCount(data.totalCount || data.LandingPageNotices.length);
        } else {
          setNoticesList([]);
          setTotalCount(0);
        }
      } catch (error) {
        console.error("Error searching notices:", error);
        setNoticesList([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [limit, tenantId]
  );

  // Pagination handlers
  const handleNextPage = () => {
    if (offset + limit < totalCount) {
      setOffset(offset + limit);
      searchNotices(offset + limit, searchText);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 200);
    }
  };

  const handlePrevPage = () => {
    if (offset - limit >= 0) {
      setOffset(offset - limit);
      searchNotices(offset - limit, searchText);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 200);
    }
  };

  const handleSearch = () => {
    setOffset(0);
    searchNotices(0, searchText);
  };

  const handleReset = () => {
    setSearchText("");
    setOffset(0);
    searchNotices(0, "");
  };

  useEffect(() => {
    // Only run initialization once
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      searchNotices(0, "");
    }
  }, [searchNotices]);

  const fetchFile = async (fileStoreId?: string): Promise<Blob | null> => {
    if (!fileStoreId) {
      console.error("File Store ID is required");
      return null;
    }

    try {
      // Direct API call to get the file
      const response = await fetch(`/api/downloadNotice`, {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenantId,
          fileStoreId,
          moduleName: "landing-page",
        }),
      });

      if (!response.ok) {
        throw new Error(`File download failed with status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error("Error fetching file:", error);
      return null;
    }
  };

  const openFileInNewTab = async (fileStoreId?: string): Promise<void> => {
    const blob = await fetchFile(fileStoreId);
    if (!blob) return;

    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 5000);
  };

  const downloadFile = async (
    fileStoreId?: string,
    fileName?: string
  ): Promise<void> => {
    const blob = await fetchFile(fileStoreId);
    if (!blob) return;

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || `notice-${fileStoreId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 5000);
  };

  return (
    <div className="max-w-screen min-h-screen mx-auto py-4 px-4 md:py-6 md:px-20 bg-white font-roboto">
      <Head>
        <title>{t("NOTICES")}</title>
      </Head>

      {isLoading && (
        <div className={commonStyles.loading.container}>
          <div className={commonStyles.loading.spinner}></div>
        </div>
      )}
      <div className="pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <SectionHeading
          title={t("NOTICES")}
          className="!text-left !mb-0"
          showBorder={false}
        />
        {/* Search Bar */}
        <div className="relative text-base flex gap-2">
          <input
            type="text"
            placeholder={t("SEARCH")}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="md:pl-10 pl-4 pr-4 py-1 font-roboto text-lg font-medium text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          {!isMobile && (
            <FiSearch className="absolute h-5 w-5 left-3 top-1/2 transform -translate-y-1/2 text-[#334155]" />
          )}
          <button
            onClick={handleSearch}
            className={`${isMobile ? "w-10 h-10 flex items-center justify-center" : "md:px-3 px-1 text-lg"} font-[Inter] font-medium text-[#0F766E] hover:text-green-800 bg-white rounded-lg border border-[#0F766E]`}
            aria-label={t("SEARCH")}
          >
            {isMobile ? <FiSearch className="h-5 w-5" /> : t("SEARCH")}
          </button>
          <button
            onClick={handleReset}
            className={`${isMobile ? "w-10 h-10 flex items-center justify-center" : "md:px-3 px-1 text-lg"} font-[Inter] font-medium text-[#64748B] hover:text-green-800 bg-white rounded-lg border border-[#64748B]`}
            aria-label={t("RESET")}
          >
            {isMobile ? <FiRefreshCw className="h-5 w-5" /> : t("RESET")}
          </button>
        </div>
      </div>
      <div className="border-b border-[#CBD5E1] w-full mx-auto mb-4 mt-4 md:mt-2"></div>

      {/* Notices Table */}
      {!isMobile && noticesList.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-[#E2E8F0]">
          <table className="w-full">
            <thead className="text-[#0F172A] text-[22px] font-semibold font-[Baskerville] bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4 text-left w-[10%]">{t("SL_NO")}</th>
                <th className="py-3 px-4 text-left w-[50%]">{t("TITLE")}</th>
                <th className="py-3 px-4 text-left w-[20%]">
                  {t("DATE_OF_ISSUE")}
                </th>
                <th className="py-3 px-4 text-left w-[20%]">{t("ACTION")}</th>
              </tr>
            </thead>
            <tbody className="text-[22px] text-[#334155] font-roboto bg-white">
              {noticesList.map((notice, index) => (
                <tr
                  key={index}
                  className={`border-b border-[#E2E8F0] ${index % 2 === 1 ? "bg-[#F8FAFC]" : ""}`}
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">
                    <a
                      href="#"
                      className="text-blue-600 hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        openFileInNewTab(notice.fileStoreId);
                      }}
                    >
                      {notice.title}
                    </a>
                  </td>
                  <td className="py-3 px-4">
                    {formatDate(notice.publishedDate)}
                  </td>
                  <td className="py-3 px-4 text-left">
                    <button
                      className="shadow-[0_2px_10px_rgba(0,0,0,0.1)] font-[Inter] inline-flex items-center justify-center gap-2 py-2 px-6 bg-[#F8FAFC] text-[#334155] text-[20px] border-2 border-[#CBD5E1] rounded-xl hover:bg-gray-50 font-medium"
                      aria-label={`${t("DOWNLOAD")} ${notice.title}`}
                      onClick={() =>
                        downloadFile(notice.fileStoreId, `${notice.title}.pdf`)
                      }
                    >
                      <FiDownload size={24} /> {t("DOWNLOAD")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isMobile &&
        noticesList.length > 0 &&
        noticesList.map((notice, index) => (
          <div
            key={index}
            className="p-4 border-x-2 border-t border-b-2 border-[#E2E8F0] bg-white mb-8 rounded-lg"
          >
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 items-center">
                <div className="font-[Baskerville] text-[14px] text-[#0F172A] font-semibold">
                  {t("TITLE")}:
                </div>
                <div className="text-[14px] text-[#334155]">
                  <a
                    href="#"
                    className="text-blue-600 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      openFileInNewTab(notice.fileStoreId);
                    }}
                  >
                    {notice.title}
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-2 items-center">
                <div className="font-[Baskerville] text-[14px] text-[#0F172A] font-semibold">
                  {t("DATE_OF_ISSUE")}:
                </div>
                <div className="text-[14px] text-[#334155]">
                  {formatDate(notice.publishedDate)}
                </div>
              </div>
              <div className="grid grid-cols-2 items-center">
                <div className="font-[Baskerville] text-[14px] text-[#0F172A] font-semibold">
                  {t("ACTION")}:
                </div>
                <button
                  className="shadow-[0_2px_10px_rgba(0,0,0,0.1)] w-fit font-[Inter] inline-flex items-center justify-center gap-2 py-2 px-6 bg-[#F8FAFC] text-[#334155] text-[14px] border-2 border-[#CBD5E1] rounded-xl hover:bg-gray-50 font-medium"
                  aria-label={`${t("DOWNLOAD")} ${notice.title}`}
                  onClick={() =>
                    downloadFile(notice.fileStoreId, `${notice.title}.pdf`)
                  }
                >
                  <FiDownload size={15} /> {t("DOWNLOAD")}
                </button>
              </div>
            </div>
          </div>
        ))}
      {noticesList.length === 0 && (
        <div className="flex justify-center items-center p-8">
          <div className="text-xl font-roboto font-medium text-gray-500">
            {t("NO_RESULTS_FOUND")}
          </div>
        </div>
      )}
      {noticesList.length > 0 && (
        <Pagination
          currentStartIndex={offset + 1}
          totalItems={totalCount}
          itemsPerPage={limit}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          isFirstPage={offset === 0}
          isLastPage={offset + limit >= totalCount}
        />
      )}
    </div>
  );
};

export default Notices;
