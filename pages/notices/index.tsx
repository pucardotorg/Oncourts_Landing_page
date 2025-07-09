import React, { useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";
import { commonStyles } from "../../styles/commonStyles";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import SectionHeading from "../../components/common/SectionHeading";
import { FiDownload } from "react-icons/fi";
import Pagination from "../../components/Utils/Pagination";

// Define the Notice type
interface Notice {
  title: string;
  publishedDate: string;
  fileStoreId: string;
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

  // Pagination handlers
  const handleNextPage = () => {
    if (offset + limit < totalCount) {
      setOffset(offset + limit);
      getNotices(); // Re-fetch with new offset
      // Scroll to top of page
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 200);
    }
  };

  const handlePrevPage = () => {
    if (offset - limit >= 0) {
      setOffset(offset - limit);
      getNotices(); // Re-fetch with new offset
      // Scroll to top of page
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 200);
    }
  };

  const getNotices = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/egov-mdms-service/v1/_search?tenantId=${tenantId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            MdmsCriteria: {
              tenantId: tenantId,
              offset: offset,
              limit: limit,
              moduleDetails: [
                {
                  moduleName: "LandingPage",
                  masterDetails: [{ name: "Notice" }],
                },
              ],
            },
            RequestInfo: {
              apiId: "Rainmaker",
              msgId: `${Date.now()}|en_IN`,
            },
          }),
        }
      );
      const data = await response.json();
      // Extract the Court_Rooms array from response
      if (
        data &&
        data.MdmsRes &&
        data.MdmsRes["LandingPage"] &&
        data.MdmsRes["LandingPage"].Notice
      ) {
        const notices: Notice[] = data.MdmsRes["LandingPage"].Notice;
        setNoticesList(notices);
        setTotalCount(data.MdmsRes["LandingPage"].Notice.length);
      }
    } catch (error) {
      console.error("Error fetching court options:", error);
      setNoticesList([]);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, offset]);

  useEffect(() => {
    // Only run initialization once
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      getNotices();
    }
  }, [getNotices]);

  return (
    <div className="max-w-screen min-h-screen mx-auto py-4 px-4 md:py-6 md:px-20 bg-white">
      <Head>
        <title>{t("NOTICES")}</title>
      </Head>

      {isLoading && (
        <div className={commonStyles.loading.container}>
          <div className={commonStyles.loading.spinner}></div>
        </div>
      )}
      <SectionHeading
        title={t("NOTICES")}
        className="!text-left !mb-0"
        showBorder={false}
      />
      <div className="border-b border-[#CBD5E1] w-full mx-auto mb-4 mt-2"></div>

      {/* Notices Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-[#E2E8F0]">
        <table className="w-full">
          <thead className="text-[#0F172A] text-[22px] font-semibold font-[Baskerville] bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <tr>
              <th className="py-3 px-4 text-left">{t("SL_NO")}</th>
              <th className="py-3 px-4 text-left">{t("TITLE")}</th>
              <th className="py-3 px-4 text-left">{t("DATE_OF_ISSUE")}</th>
              <th className="py-3 px-4 text-left">{t("ACTION")}</th>
            </tr>
          </thead>
          <tbody className="text-[22px] text-[#334155] font-[Roboto] bg-white">
            {noticesList.map((notice, index) => (
              <tr
                key={index}
                className={`border-b border-[#E2E8F0] ${index % 2 === 1 ? "bg-[#F8FAFC]" : ""}`}
              >
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">
                  <a href="#" className="text-blue-600 hover:underline">
                    {notice.title}
                  </a>
                </td>
                <td className="py-3 px-4">{notice.publishedDate}</td>
                <td className="py-3 px-4 text-left">
                  <button
                    className="shadow-[0_2px_10px_rgba(0,0,0,0.1)] inline-flex items-center justify-center gap-2 p-2 bg-[#F8FAFC] text-[#334155] text-[20px] border-2 border-[#CBD5E1] rounded-xl hover:bg-gray-50 font-medium w-[250px]"
                    aria-label={`${t("DOWNLOAD")} ${notice.title}`}
                  >
                    <FiDownload size={24} /> {t("DOWNLOAD")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentStartIndex={offset + 1}
        totalItems={totalCount}
        itemsPerPage={limit}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        isFirstPage={offset === 0}
        isLastPage={offset + limit >= totalCount}
      />
    </div>
  );
};

export default Notices;
