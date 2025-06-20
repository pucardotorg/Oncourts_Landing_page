import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SearchTabs from "../../components/search/SearchTabs";
import SearchForm from "../../components/search/SearchForm";
import AdditionalFilters from "../../components/search/AdditionalFilters";
import CaseDetailsTable from "../../components/search/CaseDetailsTable";
import DetailedViewModal from "../../components/CaseSearch/DetailedViewModal";

const SearchForCase = () => {
  const [selectedTab, setSelectedTab] = useState("Case Number");
  const [showViewDetailedModal, setShowViewDetailedModal] = useState(false);

  // Pagination state
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [totalCount, setTotalCount] = useState(0);

  // Form state
  const [formState, setFormState] = useState({
    caseNumber: "",
    selectedYear: "", // Default year kept as current year
    selectedCourt: "",
    selectedCaseType: "",
    code: "",
    cnrNumber: "",
    advocateSearchMethod: "Bar Code", // Default search method
    barCode: "",
    advocateName: "",
    litigantName: "",
  });

  // Additional filters state
  const [filterState, setFilterState] = useState({
    courtName: "",
    caseType: "",
    hearingDateFrom: "",
    hearingDateTo: "",
    filingYear: "",
    caseStage: "",
    caseStatus: "",
  });

  // Define case result type
  interface CaseResult {
    caseTitle: string;
    caseNumber: string;
    nextHearingDate: string;
    purpose: string;
  }

  const [searchResults, setSearchResults] = useState<CaseResult[]>([]);

  const router = useRouter();

  // Format date from timestamp (milliseconds) to readable format
  const formatDate = (timestamp: number | null | undefined) => {
    if (!timestamp) return "Not Available";
    return new Date(timestamp).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
  };

  // Fetch case data from API
  const fetchCase = async (url: string) => {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.log("Error fetching case data:", (error as Error).message);
      return null;
    }
  };

  // Handle tab change
  const handleTabChange = async (tab: string) => {
    setSelectedTab(tab);
    if (tab === "All") {
      // For All tab, use the case list endpoint with pagination
      const res = await fetchCase(
        `/api/case/2025/CMP?offset=${offset}&limit=${limit}`
      );

      if (res?.caseList) {
        const caseList = res.caseList || [];
        setTotalCount(res?.pagination?.totalCount || 0);

        // Define type for case items to avoid 'any'
        interface CaseItem {
          caseTitle?: string;
          caseNumber?: string;
          nextHearingDate?: number;
          purpose?: string;
        }

        // Map each case in the list to the table format
        const mappedResults = caseList.map((caseItem: CaseItem) => ({
          caseTitle: caseItem.caseTitle,
          caseNumber: caseItem.caseNumber,
          nextHearingDate: caseItem.nextHearingDate || "Not Available",
          purpose: caseItem.purpose || "Not Available",
        }));

        setSearchResults(mappedResults);
      }
    }
    // Reset form fields on tab change
    setFormState({
      ...formState,
      selectedCourt: "",
      caseNumber: "",
      selectedYear: "",
      selectedCaseType: "",
      advocateSearchMethod: "Bar Code",
      code: "",
      cnrNumber: "",
      barCode: "",
      advocateName: "",
      litigantName: "",

    });
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    if (field === "advocateSearchMethod") {
      // When advocate search method changes, clear appropriate fields
      if (value === "Bar Code") {
        // If switching to Bar Code, clear advocate name
        setFormState({
          ...formState,
          advocateSearchMethod: value,
          advocateName: "",
        });
      } else if (value === "Advocate Name") {
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

  // Handle filter changes
  const handleFilterChange = (field: string, value: string) => {
    // Update the filter state
    setFilterState({
      ...filterState,
      [field]: value,
    });
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilterState({
      courtName: "",
      caseType: "",
      hearingDateFrom: "",
      hearingDateTo: "",
      filingYear: "",
      caseStage: "",
      caseStatus: "",
    });
  };

  // Clear form
  const handleClear = () => {
    setFormState({
      caseNumber: "",
      selectedYear: "",
      selectedCourt: "",
      selectedCaseType: "",
      code: "",
      cnrNumber: "",
      advocateSearchMethod: "Bar Code",
      barCode: "",
      advocateName: "",
      litigantName: "",
    });
    // Reset pagination
    setOffset(0);
    setTotalCount(0);
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
  const handleSubmit = async () => {
    let url = "";
    switch (selectedTab) {
      case "CNR Number":
        if (formState.cnrNumber) {
          url = `/api/case/cnr/${formState.cnrNumber}`;
        }
        break;

      case "Case Number":
        if (formState.selectedYear && formState.selectedCaseType) {
          url = `/api/case/${formState.selectedYear}/${formState.selectedCaseType}/${formState.caseNumber.split("/")[1]}`;
        }

        break;

      case "Filing Number":
        if (
          formState.selectedYear &&
          formState.selectedCourt &&
          formState.code
        ) {
          url = `/api/case/${formState.selectedYear}/${formState.selectedCourt}/${formState.code}`;
        }
        break;

      case "Advocate":
        if (formState.advocateSearchMethod === "Bar Code") {
          url = `/api/case/advocate/barcode/${formState.barCode}`;
        } else {
          url = `/api/case/advocate/name/${formState.advocateName}`;
        }
        break;

      case "Litigant":
        url = `/api/case/litigant/${formState.litigantName}`;
        break;

      case "All":
        url = `/api/case/2025/CMP?offset=${offset}&limit=${limit}`;
        break;
    }

    const res = await fetchCase(url);
    console.log("API Response:", res);

    if (selectedTab === "All" && res?.caseList) {
      const caseList = res.caseList || [];
      setTotalCount(res?.pagination?.totalCount || 0);

      // Define type for case items to avoid 'any'
      interface CaseItem {
        caseTitle?: string;
        caseNumber?: string;
        nextHearingDate?: number;
        purpose?: string;
      }

      // Map each case in the list to the table format
      const mappedResults = caseList.map((caseItem: CaseItem) => ({
        caseTitle: caseItem.caseTitle,
        caseNumber: caseItem.caseNumber,
        nextHearingDate: caseItem.nextHearingDate || "Not Available",
        purpose: caseItem.purpose || "Not Available",
      }));

      setSearchResults(mappedResults);
    } else if (res?.caseSummary) {
      // Process single case response for CNR Number and Case Number tabs
      const caseSummary = res.caseSummary;
      const mappedResults = [
        {
          caseTitle: caseSummary.advocateComplainant || "Not Available",
          caseNumber:
            caseSummary.filingNumber ||
            caseSummary.registrationNumber ||
            "Not Available",
          nextHearingDate: formatDate(caseSummary.registrationDate),
          purpose: caseSummary.subStage || "Not Available",
        },
      ];

      setSearchResults(mappedResults);
    } else {
      // Handle case when no results are found
      setSearchResults([]);
      console.log("No results found or API error");
    }
  };

  // Handle view case details
  const handleViewCaseDetails = () => {
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
  }, [router.isReady, router.query]);

  return (
    <div className="max-w-screen mx-auto py-6 px-20">
      <h1
        className="text-center mb-6  text-6xl"
        style={{
          fontFamily: "Libre Baskerville",
          fontWeight: 400,
          color: "#3A3A3A",
        }}
      >
        Case Search
      </h1>
      {/* Search Container */}
      <div>
        {/* Search Tabs */}
        <SearchTabs selectedTab={selectedTab} onTabChange={handleTabChange} />

        {/* Search Form - Only show if not "All" tab */}
        {selectedTab !== "All" && (
          <SearchForm
            selectedTab={selectedTab}
            formState={{
              ...formState,
              handleClear,
              handleSubmit,
            }}
            handleInputChange={handleInputChange}
          />
        )}
      </div>
      {selectedTab === "All" && searchResults?.length > 0 && (
        <div className="text-xl font-semibold text-[#EA580C] italic">
          Choose from filter to search cases
        </div>
      )}
      {/* Additional Filters */}
      {searchResults?.length > 0 &&
        ["All", "Advocate", "Litigant"].includes(selectedTab) && (
          <AdditionalFilters
            selectedTab={selectedTab}
            filterState={filterState}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        )}

      {/* Case Details Table with built-in pagination */}
      {searchResults?.length > 0 && (
        <CaseDetailsTable
          searchResults={searchResults}
          onViewCaseDetails={handleViewCaseDetails}
          totalCount={totalCount}
          offset={offset}
          limit={limit}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
      )}
      {showViewDetailedModal &&
        <DetailedViewModal onClose={() => setShowViewDetailedModal(false)} />
      }

    </div>
  );
};

export default SearchForCase;
