import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import SearchTabs from "../../components/search/SearchTabs";
import SearchForm from "../../components/search/SearchForm";
import AdditionalFilters from "../../components/search/AdditionalFilters";
import CaseDetailsTable from "../../components/search/CaseDetailsTable";
import {
  FormState,
  FilterState,
  CaseResult,
  CourtRoom,
  CaseStage,
  CaseType,
  CaseStatus,
} from "../../types";
import { isFormValid, searchCases } from "../../utils/searchUtils";
import { newCaseSearchConfig } from "../../data/newCaseSearchConfig";
import { commonStyles, animations } from "../../styles/commonStyles";
import DetailedViewModal from "../../components/search/DetailedViewModal";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

const SearchForCase = () => {
  const { t } = useSafeTranslation();
  const [selectedTab, setSelectedTab] = useState("case_number");
  const [showViewDetailedModal, setShowViewDetailedModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseResult>({
    caseTitle: "",
    cmpNumber: "",
    stNumber: "",
    purpose: "",
    nextHearingDate: "",
    lastHearingDate: "",
    filingDate: "",
    registrationDate: "",
    filingNumber: "",
    courtId: "",
    courtName: "",
    cnrNumber: "",
    caseStage: "",
    caseSubStage: "",
    advocates: [],
    litigants: [],
  });

  // Error notification state
  const [errorNotification, setErrorNotification] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });

  // Pagination state
  const [offset, setOffset] = useState(0);
  const limit = 50;
  const [totalCount, setTotalCount] = useState(0);
  const tenantId = localStorage.getItem("tenant-id") || "kl";
  const [courtOptions, setCourtOptions] = useState<CourtRoom[]>([]);
  const [caseStageOptions, setCaseStageOptions] = useState<CaseStage[]>([]);
  const [caseStatusOptions, setCaseStatusOptions] = useState<CaseStatus[]>([]);
  const [caseTypeOptions, setCaseTypeOptions] = useState<CaseType[]>([]);

  // Use useMemo to create stable references to default states
  const defaultFormState = useMemo(
    () => ({
      caseNumber: "",
      selectedYear: "",
      selectedCourt: "",
      selectedCaseType: "",
      code: "",
      cnrNumber: "",
      advocateSearchMethod: "bar_code", // Default search method
      barCode: "",
      stateCode: "",
      advocateName: "",
      litigantName: "",
    }),
    []
  );
  // Form state
  const [formState, setFormState] = useState<FormState>(defaultFormState);

  const defaultFilterState = useMemo(
    () => ({
      courtName: "",
      caseType: "",
      hearingDateFrom: "",
      hearingDateTo: "",
      caseSubStage: "",
      caseStatus: "",
      yearOfFiling: "",
      caseTitle: "",
    }),
    []
  );

  // Additional filters state
  const [filterState, setFilterState] =
    useState<FilterState>(defaultFilterState);

  const [searchResults, setSearchResults] = useState<CaseResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Ref to track initial API calls and prevent duplicate calls
  const initialLoadRef = useRef<boolean>(false);

  const getCourtOptions = useCallback(async () => {
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
              moduleDetails: [
                {
                  moduleName: "common-masters",
                  masterDetails: [{ name: "Court_Rooms" }],
                },
                {
                  moduleName: "case",
                  masterDetails: [
                    { name: "SubStage" },
                    { name: "casetype" },
                    { name: "casestatus" },
                  ],
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
        data.MdmsRes["common-masters"] &&
        data.MdmsRes["common-masters"].Court_Rooms
      ) {
        const courtRooms: CourtRoom[] =
          data.MdmsRes["common-masters"].Court_Rooms;
        setCourtOptions(courtRooms);
        setFormState({
          ...defaultFormState,
          selectedCourt: courtRooms[0]?.name || "",
        });
        setFilterState({
          ...defaultFilterState,
          courtName: courtRooms[0]?.name || "",
        });
      }
      if (data && data.MdmsRes && data.MdmsRes["case"]) {
        if (data.MdmsRes["case"].SubStage) {
          const caseStages: CaseStage[] = data.MdmsRes["case"].SubStage;
          setCaseStageOptions(caseStages);
        }
        if (data.MdmsRes["case"].casetype) {
          const caseTypes: CaseType[] = data.MdmsRes["case"].casetype;
          setCaseTypeOptions(caseTypes);
        }
        if (data.MdmsRes["case"].casestatus) {
          const caseStatuses: CaseStatus[] = data.MdmsRes["case"].casestatus;
          setCaseStatusOptions(caseStatuses);
        }
      }
    } catch (error) {
      console.error("Error fetching court options:", error);
      setCourtOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, defaultFormState, defaultFilterState]);

  // Reset filters
  const handleResetFilters = (newFilterState?: FilterState) => {
    setFilterState(newFilterState || defaultFilterState);
  };

  // Centralized handler to update filter state and trigger search
  const handleFilterChangeAndSearch = (newFilterState: FilterState) => {
    setFilterState(newFilterState);
    handleSubmit(newFilterState);
  };

  // Centralized handler to reset filter state and trigger search
  const handleResetFiltersAndSearch = () => {
    if (selectedTab === "all" && courtOptions.length > 0) {
      const defaultCourt = courtOptions[0]?.name || "";
      handleResetFilters({
        ...defaultFilterState,
        courtName: defaultCourt,
      });
      handleSubmit({
        ...defaultFilterState,
        courtName: defaultCourt,
      });
    } else {
      handleResetFilters();
      handleSubmit(defaultFilterState);
    }
  };

  // Handle tab change
  const handleTabChange = async (tab: string) => {
    setSelectedTab(tab);

    const defaultCourt =
      courtOptions.length > 0 ? courtOptions[0]?.name || "" : "";

    // Reset form fields on tab change
    setFormState({
      ...defaultFormState,
      selectedCourt: defaultCourt,
    });

    if (tab === "all") {
      handleResetFilters({
        ...defaultFilterState,
        courtName: defaultCourt,
      });
    } else {
      handleResetFilters();
    }

    // Reset search results and pagination
    setOffset(0);
    setSearchResults([]);

    // Load initial data for "All" tab
    if (tab === "all") {
      await fetchAllCases();
    }
  };

  // Fetch all cases for "All" tab
  const fetchAllCases = async () => {
    setIsLoading(true);
    // Hide any previous errors
    setErrorNotification({ show: false, message: "" });

    const {
      results,
      totalCount: count,
      error,
    } = await searchCases("all", { offset, limit });

    if (error) {
      setErrorNotification({
        show: true,
        message:
          error.message ||
          "An error occurred while loading cases. Please try again.",
      });
      setSearchResults([]);
      setTotalCount(0);

      // Auto-hide error notification after 2 seconds
      setTimeout(() => {
        setErrorNotification({ show: false, message: "" });
      }, 2000);
    } else {
      setSearchResults(results);
      setTotalCount(count);
    }

    setIsLoading(false);
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    if (field === "advocateSearchMethod") {
      // When advocate search method changes, clear appropriate fields
      if (value === "bar_code") {
        // If switching to Bar Code, clear advocate name
        setFormState({
          ...formState,
          advocateSearchMethod: value,
          advocateName: "",
        });
      } else if (value === "advocate_name") {
        // If switching to Advocate Name, clear bar code fields
        setFormState({
          ...formState,
          advocateSearchMethod: value,
          barCode: "",
          code: "",
          selectedYear: "", // Reset to default year
        });
      }
    } else {
      // Normal field update for other fields
      setFormState({
        ...formState,
        [field]: value,
      });
    }
  };

  // Clear form
  const handleClear = () => {
    setFormState({
      ...defaultFormState,
      selectedCourt: courtOptions.length > 0 ? courtOptions[0]?.name || "" : "",
    });
    // Reset pagination
    setOffset(0);
    setTotalCount(0);
    setSearchResults([]);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (offset + limit < totalCount) {
      setOffset(offset + limit);
      handleSubmit(); // Re-fetch with new offset
    }
  };

  const handlePrevPage = () => {
    if (offset - limit >= 0) {
      setOffset(offset - limit);
      handleSubmit(); // Re-fetch with new offset
    }
  };

  // Submit form
  const handleSubmit = async (filterStateOverride?: FilterState) => {
    // Check if form is valid before submission
    if (!isFormValid(selectedTab, formState)) {
      return;
    }

    setIsLoading(true);
    // Hide any previous errors
    setErrorNotification({ show: false, message: "" });

    // Use the searchCases utility function which handles URL building, fetching, and transformation
    const {
      results,
      totalCount: count,
      error,
    } = await searchCases(
      selectedTab,
      {
        ...formState,
        offset,
        limit,
      },
      filterStateOverride || filterState
    );

    // Handle API errors
    if (error) {
      setErrorNotification({
        show: true,
        message:
          error.message ||
          "An error occurred while searching. Please try again.",
      });
      setSearchResults([]);
      setTotalCount(0);

      // Auto-hide error notification after 2 seconds
      setTimeout(() => {
        setErrorNotification({ show: false, message: "" });
      }, 2000);
    } else {
      setSearchResults(results);
      setTotalCount(count);

      // Show toast if no results found for Advocate/Litigant tabs
      if (results.length === 0 && !["all"].includes(selectedTab)) {
        setErrorNotification({
          show: true,
          message: t("NO_RESULTS_FOUND"),
        });

        // Auto-hide error notification after 2 seconds
        setTimeout(() => {
          setErrorNotification({ show: false, message: "" });
        }, 2000);
      }
    }

    setIsLoading(false);
  };

  // Handle view case details
  const handleViewCaseDetails = (caseResult: CaseResult) => {
    setSelectedCase(caseResult);
    setShowViewDetailedModal(true);
  };

  useEffect(() => {
    if (!router.isReady) return;
    const {
      selectedTab,
      caseNumber,
      selectedYear,
      selectedCourt,
      selectedCaseType,
      code,
    } = router.query;

    if (selectedTab) setSelectedTab(selectedTab as string);

    setFormState((prevState) => ({
      ...prevState,
      caseNumber: (caseNumber as string) || prevState.caseNumber,
      selectedYear: (selectedYear as string) || prevState.selectedYear,
      selectedCourt: (selectedCourt as string) || prevState.selectedCourt,
      selectedCaseType:
        (selectedCaseType as string) || prevState.selectedCaseType,
      code: (code as string) || prevState.code,
    }));

    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      getCourtOptions();
    }
  }, [router.isReady, router.query, getCourtOptions]);

  return (
    <div className={commonStyles.container}>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: animations }} />
      </Head>
      <h1
        className={commonStyles.heading.primary}
        style={{ color: commonStyles.colors.text, fontFamily: "Baskerville" }}
      >
        {t(newCaseSearchConfig?.heading)}
      </h1>
      {/* Search Container */}
      <div>
        {/* Search Tabs */}
        <SearchTabs
          t={t}
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
          tabs={newCaseSearchConfig.tabs}
        />

        {/* Search Form - Only show if not "All" tab */}
        {selectedTab !== "all" && (
          <SearchForm
            t={t}
            selectedTab={selectedTab}
            formState={{
              ...formState,
              handleClear,
              handleSubmit: handleResetFiltersAndSearch,
            }}
            handleInputChange={handleInputChange}
            courtOptions={courtOptions}
          />
        )}
      </div>
      {selectedTab === "all" && searchResults?.length > 0 && (
        <div className={commonStyles.heading.accent}>
          {t("CHOOSE_FROM_FILTER_TO_SEARCH_CASES")}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className={commonStyles.loading.container}>
          <div className={commonStyles.loading.spinner}></div>
        </div>
      )}

      {/* Error Notification - Bottom Center with Auto Close */}
      {errorNotification.show && (
        <div
          className={`${commonStyles.notification.container} ${commonStyles.notification.bottomCenter} ${commonStyles.notification.error}`}
          style={{
            minWidth: "300px",
            maxWidth: "80%",
            animation: "fadeInUp 0.3s ease-out forwards",
          }}
        >
          <div className="flex items-center justify-center w-full">
            <svg
              className={commonStyles.notification.icon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className={commonStyles.notification.message}>
              {errorNotification.message}
            </span>
          </div>
        </div>
      )}
      {/* Additional Filters */}
      {(selectedTab === "all" ||
        (searchResults?.length > 0 &&
          ["advocate", "litigant"].includes(selectedTab))) && (
        <AdditionalFilters
          selectedTab={selectedTab}
          filterState={filterState}
          onApplyFilters={handleFilterChangeAndSearch}
          onResetFilters={handleResetFiltersAndSearch}
          courtOptions={courtOptions}
          caseStageOptions={caseStageOptions}
          caseTypeOptions={caseTypeOptions}
          caseStatusOptions={caseStatusOptions}
        />
      )}

      {/* Case Details Table with built-in pagination */}
      {(selectedTab === "all" || searchResults?.length > 0) && (
        <CaseDetailsTable
          selectedTab={selectedTab}
          searchResults={searchResults}
          onViewCaseDetails={handleViewCaseDetails}
          totalCount={totalCount}
          offset={offset}
          limit={limit}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          filterState={filterState}
          onSearch={handleFilterChangeAndSearch}
        />
      )}
      {showViewDetailedModal && (
        <DetailedViewModal
          tenantId={tenantId}
          onClose={() => setShowViewDetailedModal(false)}
          caseResult={selectedCase}
        />
      )}
    </div>
  );
};

export default SearchForCase;
