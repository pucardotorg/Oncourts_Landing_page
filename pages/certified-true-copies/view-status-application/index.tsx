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

// --- Mock Data & Configuration ---
interface ApplicationData {
  id: string;
  slNo: number;
  caseName: string;
  caseNumber: string;
  application: string;
  applicationDate: string;
  status: "Approved" | "Pending" | "Rejected" | "Drafted";
  hasDocument: boolean;
}

const MOCK_APPLICATIONS: ApplicationData[] = [
  {
    id: "1",
    slNo: 1,
    caseName: "Vikram Singh vs Anamika",
    caseNumber: "ST|1235|2025",
    application: "CA/1/2026",
    applicationDate: "March 15, 2023",
    status: "Approved",
    hasDocument: true,
  },
  {
    id: "2",
    slNo: 2,
    caseName: "Vikram Singh vs Anamika",
    caseNumber: "ST|1235|2025",
    application: "CA/2/2026",
    applicationDate: "May 30, 2023",
    status: "Pending",
    hasDocument: false,
  },
  {
    id: "3",
    slNo: 3,
    caseName: "Vikram Singh vs Anamika",
    caseNumber: "ST|1235|2025",
    application: "CA/3/2026",
    applicationDate: "July 5, 2023",
    status: "Rejected",
    hasDocument: false,
  },
  {
    id: "4",
    slNo: 3,
    caseName: "Vikram Singh vs Anamika",
    caseNumber: "ST|1235|2025",
    application: "CA/3/2026",
    applicationDate: "July 5, 2023",
    status: "Drafted",
    hasDocument: false,
  },
];

const statusStyles = {
  Approved: "bg-[#D1FAE5] text-[#047857]",
  Pending: "bg-[#FFEDD5] text-[#B45309]",
  Rejected: "bg-[#FCE7F3] text-[#BE185D]",
  Drafted: "bg-[#DBEAFE] text-[#1D4ED8]",
};

const viewStatusForCertifiedTrueCopy = () => {
  const [isLoading, setIsLoading] = useState(false);
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

  const showErrorToast = (message: string) => {
    setErrorToast({ show: true, message });
    setTimeout(() => {
      setErrorToast({ show: false, message: "" });
    }, 4000);
  };

  const handleClear = () => {
    setPhoneNumber("");
    setIsPhoneVerified(false);
  };

  const handleSearchApplication = () => {
    if (!isPhoneVerified) return;
    console.log("Searching application for:", phoneNumber);
  };

  // Filter logic
  const filteredApplications = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return MOCK_APPLICATIONS.filter(
      (app) =>
        app.caseNumber.toLowerCase().includes(q) ||
        app.caseName.toLowerCase().includes(q)
    );
  }, [searchQuery]);

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
              router.back();
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
                  ctcText?.viewStatus?.searchButtonLabel || "Search Application"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* My Applications Section */}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by case number or case name"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F766E] text-[#64748B] text-[15px]"
              />
            </div>
          </div>

          <ConfigurableTable
            columns={[
              { key: "slNo", header: t("SL_NO") },
              { key: "caseName", header: t("CASE_NAME") },
              { key: "caseNumber", header: t("CASE_NUMBER") },
              {
                key: "application",
                header: t("APPLICATION"),
                render: (app) => (
                  <div className="flex items-center gap-2">
                    <span className="text-[#64748B] mt-0.5">
                      {svgIcons.SmallFileIcon()}
                    </span>
                    <a
                      href="#"
                      className="underline decoration-1 underline-offset-2"
                    >
                      {app.application}
                    </a>
                  </div>
                ),
              },
              { key: "applicationDate", header: t("APPLICATION_DATE") },
              {
                key: "status",
                header: "Status",
                render: (app) => (
                  <span
                    className={`px-2.5 py-1 text-sm font-semibold rounded-md ${
                      statusStyles[app.status]
                    }`}
                  >
                    {app.status}
                  </span>
                ),
              },
              {
                key: "hasDocument",
                header: t("ISSUE_DOCUMENT"),
                render: (app) =>
                  app.hasDocument ? (
                    <div className="flex items-center gap-2 text-[#475569]">
                      <span className="text-[#64748B]">
                        {svgIcons.fileIcon()}
                      </span>
                      <a
                        href="#"
                        className="underline decoration-1 underline-offset-2"
                      >
                        {t(ctcText?.viewCTCStatusTable?.viewText)}
                      </a>
                    </div>
                  ) : null,
              },
            ]}
            data={filteredApplications}
            emptyMessage="No applications found."
          />
        </div>
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
    </div>
  );
};

export default viewStatusForCertifiedTrueCopy;
