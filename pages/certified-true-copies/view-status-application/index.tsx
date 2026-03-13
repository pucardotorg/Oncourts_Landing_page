import React, { useState, useMemo } from "react";
import { ctcStyles, ctcText } from "../../../styles/certifiedCopyStyles";
import Head from "next/head";
import { useSafeTranslation } from "../../../hooks/useSafeTranslation";
import { useRouter } from "next/router";
import { useMediaQuery } from "@mui/material";
import { commonStyles } from "../../../styles/commonStyles";
import { svgIcons } from "../../../data/svgIcons";
import VerifyMobileNumber from "../../../components/certified-true-copies/VerifyMobileNumber";
import ConfigurableTable from "../../../components/common/ConfigurableTable";
import ViewApplicationModal from "../../../components/certified-true-copies/ViewApplicationModal";
import SelectDocumentsModal from "../../../components/certified-true-copies/SelectDocumentsModal";
import { AuthData, CtcApplication } from "../../../types";
import { searchCtcApplications } from "../../../services/ctcService";
import { formatDate } from "../../../utils/formatDate";

const statusStyles = {
  DRAFT_IN_PROGRESS: "bg-[#DBEAFE] text-[#1D4ED8]",
  PENDING_SIGN: "bg-[#FFEDD5] text-[#B45309]",
  PENDING_PAYMENT: "bg-[#FFEDD5] text-[#B45309]",
  PENDING_APPROVAL: "bg-[#FFEDD5] text-[#B45309]",
  PENDING_ISSUE: "bg-[#FFEDD5] text-[#B45309]",
  PARTIALLY_ISSUED: "bg-[#FFEDD5] text-[#B45309]",
  ISSUED: "bg-[#D1FAE5] text-[#047857]",
  REJECTED: "bg-[#FCE7F3] text-[#BE185D]",
  DELETED: "bg-[#FCE7F3] text-[#BE185D]",
};

const allowedStatuses = [
  "DRAFT_IN_PROGRESS",
  "PENDING_PAYMENT",
  "PENDING_SIGN",
];

const ViewStatusForCertifiedTrueCopy = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const { t } = useSafeTranslation();
  const isMobile = useMediaQuery("(max-width:640px)");
  const router = useRouter();
  const tenantId = localStorage.getItem("tenant-id") || "kl";
  const [errorToast, setErrorToast] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });

  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState<CtcApplication[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [offset, setOffset] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<CtcApplication | null>(null);
  const limit = 20;
  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [selectedFileStoreId, setSelectedFileStoreId] = useState("");

  // View Documents modal state
  const [viewDocsApplication, setViewDocsApplication] =
    useState<CtcApplication | null>(null);

  const showErrorToast = (message: string) => {
    setErrorToast({ show: true, message });
    setTimeout(() => {
      setErrorToast({ show: false, message: "" });
    }, 4000);
  };

  const handleClear = () => {
    setPhoneNumber("");
    setIsPhoneVerified(false);
    setApplications([]);
    setAuthData(null);
    setSearchQuery("");
    setOffset(0);
    setTotalCount(0);
    setHasSearched(false);
  };

  const handleSearchApplication = () => {
    if (!authData) return;
    setIsPhoneVerified(true);
    setHasSearched(true);
    setOffset(0);
    fetchTableData(0);
  };

  const handleNextPage = () => {
    if (offset + limit < totalCount) {
      setOffset(offset + limit);
      fetchTableData(offset + limit);
    }
  };

  const handlePrevPage = () => {
    if (offset - limit >= 0) {
      setOffset(offset - limit);
      fetchTableData(offset - limit);
    }
  };

  const handleDownload = async (fileStoreId: string) => {
    try {
      const res = await fetch(
        `/api/getFileByFileStoreId?tenantId=${tenantId || "kl"}&fileStoreId=${fileStoreId}`,
        {
          headers: authData?.authToken
            ? { "auth-token": authData.authToken }
            : {},
        },
      );
      if (res.status === 200) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `document-${fileStoreId}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const fetchTableData = async (
    currentOffset: number = offset,
    query: string = searchQuery,
  ) => {
    if (!authData?.authToken) {
      showErrorToast(t(ctcText.viewStatus.tokenMissing));
      return;
    }

    setIsLoading(true);

    try {
      const res = await searchCtcApplications(
        {
          tenantId: tenantId,
          ...(query?.trim() && { searchText: query.trim() }),
        },
        authData,
        { offSet: currentOffset, limit },
      );

      const applications = res?.ctcApplications;
      if (applications?.length) {
        setApplications(applications);
        setTotalCount(res?.totalCount || 0);
      } else {
        console.warn("No applications returned, falling back to mock data.");
      }
    } catch (error) {
      console.error("Fetch applications failed:", error);
      showErrorToast(t(ctcText.viewStatus.fetchFailed));
    } finally {
      setIsLoading(false);
    }
  };

  // Use the actual data from the API rather than filtering on the frontend
  const applicationsToDisplay = useMemo(() => {
    return applications?.map((application, index) => {
      let formattedDate = "-";
      if (application?.auditDetails?.createdTime) {
        formattedDate = formatDate(
          application?.auditDetails?.createdTime,
          "long",
        );
      }

      return {
        ...application,
        slNo: offset + index + 1,
        hasDocument: application?.status
          ? ["PARTIALLY_ISSUED", "ISSUED"]?.includes(application?.status)
          : false,
        applicationDate: formattedDate,
      };
    });
  }, [offset, applications]);

  return (
    <div className={ctcStyles.page}>
      <Head>
        <title>{t(ctcText?.viewStatus?.pageTitle)}</title>
      </Head>

      {isLoading && (
        <div className={commonStyles?.loading?.container}>
          <div className={commonStyles?.loading?.spinner}></div>
        </div>
      )}

      {/* Container restricted to max-w-[1060px] to match Figma UI proportions */}
      <div className="w-full flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex justify-center items-center relative mb-6">
          <button
            onClick={() => {
              router.replace("/certified-true-copies");
            }}
            className={ctcStyles.backButton}
          >
            {svgIcons.BackArrowIcon()}
          </button>

          <h1
            className={
              isMobile
                ? ctcStyles.pageHeadingMobile
                : ctcStyles.pageHeadingDesktop
            }
            style={ctcStyles.pageHeadingStyle}
          >
            {t(ctcText?.viewStatus?.pageTitle)}
          </h1>
        </div>

        {/* Card Content for Phone Verification */}
        <div className={`${ctcStyles.card} mb-8`}>
          <div className="flex flex-col gap-8">
            <div className="w-full flex justify-start">
              <div className="flex flex-col w-full lg:w-1/2 min-w-0">
                <VerifyMobileNumber
                  phoneNumber={phoneNumber}
                  onPhoneNumberChange={setPhoneNumber}
                  isPhoneVerified={isPhoneVerified}
                  onVerified={() => setIsPhoneVerified(true)}
                  tenantId={tenantId}
                  filingNumber={""}
                  courtId={""}
                  showErrorToast={showErrorToast}
                  isViewApplication={true}
                  onAuthDataReceived={(data: AuthData) => {
                    setAuthData(data);
                  }}
                />
              </div>
            </div>

            <div className={ctcStyles.divider} />

            <div className="flex justify-end gap-4 font-[Inter] font-medium">
              <button
                onClick={handleClear}
                className="px-8 py-2 text-lg rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white font-roboto font-medium"
              >
                {t(ctcText?.viewStatus?.clearButtonLabel || "Clear")}
              </button>
              <button
                onClick={handleSearchApplication}
                disabled={!isPhoneVerified}
                className={`px-8 py-2 text-lg rounded-md border border-transparent focus:outline-none shadow-sm font-roboto font-medium ${
                  isPhoneVerified
                    ? "bg-[#0F766E] text-white hover:bg-teal-700"
                    : "bg-[#EEF2F6] text-[#94A3B8] cursor-not-allowed border-none"
                }`}
              >
                {t(
                  ctcText?.viewStatus?.searchButtonLabel ||
                    "Search Application",
                )}
              </button>
            </div>
          </div>
        </div>

        {/* My Applications Section */}
        {hasSearched && !isLoading && (
          <div className="w-full mt-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-4">
              <h2 className="text-[#1E293B] text-[28px] font-bold font-roboto">
                {t(ctcText?.viewCTCStatusTable?.header)}
              </h2>

              <div className="relative w-full sm:w-[380px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {svgIcons.SearchIcon2({ width: "20px", height: "20px" })}
                </div>
                <input
                  type="text"
                  defaultValue={searchQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (debounceTimerRef.current) {
                      clearTimeout(debounceTimerRef.current);
                    }
                    debounceTimerRef.current = setTimeout(() => {
                      setSearchQuery(val);
                      setOffset(0); // Reset pagination on new search
                      // Trigger API call directly if phone is verified
                      if (isPhoneVerified && authData) {
                        fetchTableData(0, val);
                      }
                    }, 500); // 500ms debounce
                  }}
                  placeholder={t(ctcText.viewStatus.searchPlaceholder)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F766E] text-[#64748B] text-[15px]"
                />
              </div>
            </div>

            <ConfigurableTable
              columns={[
                { key: "slNo", header: t("SL_NO") },
                {
                  key: "caseTitle",
                  header: t("CASE_NAME"),
                },
                { key: "caseNumber", header: t("CASE_NUMBER") },
                {
                  key: "application",
                  header: t("APPLICATION"),
                  render: (app) => (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (allowedStatuses.includes(app?.status || "")) {
                          if (authData) {
                            sessionStorage.setItem(
                              "ctcAuthData",
                              JSON.stringify(authData),
                            );
                          }
                          router.push(
                            `/certified-true-copies/apply?applicationNumber=${encodeURIComponent(
                              app?.ctcApplicationNumber || "",
                            )}&courtId=${encodeURIComponent(
                              app?.courtId || "",
                            )}&filingNumber=${encodeURIComponent(
                              app?.filingNumber || "",
                            )}`,
                          );
                          return;
                        }
                        // Extract fileStoreId from documents for SIGNED_CTC_APPLICATION
                        const signedDoc = app?.documents?.find(
                          (doc) =>
                            doc.documentType === "SIGNED_CTC_APPLICATION",
                        );
                        setSelectedFileStoreId(signedDoc?.fileStore || "");
                        setSelectedApplication(app);
                      }}
                      className="flex items-center gap-2 focus:outline-none hover:text-teal-700"
                    >
                      <span className="text-[#64748B] mt-0.5">
                        {svgIcons.SmallFileIcon()}
                      </span>
                      <span className="underline decoration-1 underline-offset-2">
                        {app?.ctcApplicationNumber}
                      </span>
                    </button>
                  ),
                },
                { key: "applicationDate", header: t("APPLICATION_DATE") },
                {
                  key: "status",
                  header: "Status",
                  render: (app) => (
                    <span
                      className={`px-2.5 py-1 text-xl font-medium rounded-md ${
                        statusStyles[app?.status || "DRAFT_IN_PROGRESS"]
                      }`}
                    >
                      {t(
                        `CTC_${app?.status}` ||
                          ctcText.viewStatus.unknownStatus,
                      )}
                    </span>
                  ),
                },
                {
                  key: "hasDocument",
                  header: t("ISSUE_DOCUMENT"),
                  render: (app) =>
                    app.hasDocument ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setViewDocsApplication(app);
                        }}
                        className="flex items-center gap-2 focus:outline-none hover:text-teal-700 text-[#334155]"
                      >
                        <span className="text-[#334155]">
                          {svgIcons.fileIcon()}
                        </span>
                        <span className="underline decoration-1 underline-offset-2">
                          {t(ctcText?.viewCTCStatusTable?.viewText)}
                        </span>
                      </button>
                    ) : null,
                },
              ]}
              data={applicationsToDisplay}
              emptyMessage="No applications found."
              totalCount={totalCount}
              limit={limit}
              offset={offset}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
            />
          </div>
        )}
      </div>

      {/* ── Error toast notification ──────────────────────────────────── */}
      {errorToast?.show && (
        <div
          className={`${commonStyles?.notification?.container} ${commonStyles?.notification?.bottomCenter} ${commonStyles?.notification?.error}`}
          style={{ animation: "fadeInUp 0.3s ease-out" }}
        >
          <svg
            className={commonStyles?.notification?.icon}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span className={commonStyles?.notification?.message}>
            {errorToast?.message}
          </span>
        </div>
      )}

      {/* ── View Application Modal ────────────────────────────────────── */}
      <ViewApplicationModal
        t={t}
        isOpen={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
        application={selectedApplication}
        topInfoColumns={
          selectedApplication
            ? [
                [
                  {
                    label: t("CASE_NAME"),
                    value: selectedApplication?.caseTitle || "N/A",
                  },
                  {
                    label: t("CASE_CATEGORY"),
                    value: t(ctcText.viewStatus.criminal),
                  },
                ],
                [
                  {
                    label: t("CASE_NUMBER"),
                    value: selectedApplication?.caseNumber || "N/A",
                  },
                  {
                    label: t("CASE_TYPE"),
                    value: t(ctcText.viewStatus.niaS138),
                  },
                ],
                [
                  {
                    label: t("FILING_NUMBER"),
                    value: selectedApplication?.filingNumber || "N/A",
                  },
                  {
                    label: t("FILING_DATE"),
                    value: selectedApplication?.auditDetails?.createdTime
                      ? formatDate(
                          selectedApplication.auditDetails.createdTime,
                          "dd-MM-yyyy",
                        )
                      : "-",
                  },
                ],
              ]
            : []
        }
        modalTitle={t("VIEW_APPLICATION")}
        footerButtons={[
          {
            label: t("CTC_OTP_GO_BACK"),
            onClick: () => setSelectedApplication(null),
            variant: "secondary",
          },
          {
            label: t(`CTC_SUCCESS_DOWNLOAD`),
            onClick: () => handleDownload(selectedFileStoreId),
            disabled: !selectedFileStoreId,
            variant: "primary",
          },
        ]}
        fileStoreId={selectedFileStoreId}
        tenantId={tenantId}
        authToken={authData?.authToken}
      />

      {/* ── View Documents Modal (Issue Document column) ──────────────── */}
      <SelectDocumentsModal
        isOpen={!!viewDocsApplication}
        onClose={() => setViewDocsApplication(null)}
        onSelect={() => {}}
        documents={viewDocsApplication?.selectedCaseBundle || []}
        isViewMode={true}
        modalTitle={t(ctcText.viewDocs.title)}
        tenantId={tenantId}
        authData={authData}
        onDownloadSelected={async (fileStoreIds) => {
          for (const fsId of fileStoreIds) {
            await handleDownload(fsId);
          }
        }}
      />
    </div>
  );
};

export default ViewStatusForCertifiedTrueCopy;
