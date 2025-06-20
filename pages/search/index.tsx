import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import SearchTabs from "../../components/search/SearchTabs";
import SearchForm from "../../components/search/SearchForm";
import AdditionalFilters from "../../components/search/AdditionalFilters";
import CaseDetailsTable from "../../components/search/CaseDetailsTable";
import { FormState, FilterState, CaseResult } from "../../types/search";
import { isFormValid, searchCases } from "../../utils/searchUtils";
import DetailedViewModal from "../../components/CaseSearch/DetailedViewModal";
import { newCaseSearchConfig } from "../../data/newCaseSearchConfig";
import { commonStyles, animations } from "../../styles/commonStyles";

const SearchForCase = () => {
  const [selectedTab, setSelectedTab] = useState("Case Number");
  const [showViewDetailedModal, setShowViewDetailedModal] = useState(false);
  
  // Error notification state
  const [errorNotification, setErrorNotification] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });

  // Pagination state
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [totalCount, setTotalCount] = useState(0);

  // Form state
  const [formState, setFormState] = useState<FormState>({
    caseNumber: "",
    selectedYear: "",
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
  const [filterState, setFilterState] = useState<FilterState>({
    courtName: "",
    caseType: "",
    hearingDateFrom: "",
    hearingDateTo: "",
    filingYear: "",
    caseStage: "",
    caseStatus: "",
  });

  const [searchResults, setSearchResults] = useState<CaseResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Handle tab change
  const handleTabChange = async (tab: string) => {
    setSelectedTab(tab);
    
    // Reset form fields on tab change
    setFormState({
      caseNumber: "",
      selectedYear: "",
      selectedCourt: "",
      selectedCaseType: "",
      advocateSearchMethod: "Bar Code",
      code: "",
      cnrNumber: "",
      barCode: "",
      advocateName: "",
      litigantName: "",
    });
    
    // Reset search results and pagination
    setOffset(0);
    setSearchResults([]);
    
    // Load initial data for "All" tab
    if (tab === "All") {
      await fetchAllCases();
    }
  };
  
  // Fetch all cases for "All" tab
  const fetchAllCases = async () => {
    setIsLoading(true);
    // Hide any previous errors
    setErrorNotification({ show: false, message: "" });
    
    const { results, totalCount: count, error } = await searchCases("All", { offset, limit });
    
    if (error) {
      setErrorNotification({ 
        show: true, 
        message: error.message || "An error occurred while loading cases. Please try again." 
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
    // Check if form is valid before submission
    if (!isFormValid(selectedTab, formState)) {
      return;
    }
    
    setIsLoading(true);
    // Hide any previous errors
    setErrorNotification({ show: false, message: "" });
    
    // Use the searchCases utility function which handles URL building, fetching, and transformation
    const { results, totalCount: count, error } = await searchCases(selectedTab, {
      ...formState,
      offset,
      limit
    });
    
    // Handle API errors
    if (error) {
      setErrorNotification({ 
        show: true, 
        message: error.message || "An error occurred while searching. Please try again." 
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
    <div className={commonStyles.container}>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: animations }} />
      </Head>
      <h1 
        className={commonStyles.heading.primary}
        style={{ color: commonStyles.colors.text }}
      >
        {newCaseSearchConfig.heading}</h1>
      {/* Search Container */}
      <div>
        {/* Search Tabs */}
        <SearchTabs 
          selectedTab={selectedTab} 
          onTabChange={handleTabChange} 
          tabs={newCaseSearchConfig.tabs}
        />

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
      {selectedTab === "All" && (
        <div className={commonStyles.heading.accent}>
          Choose from filter to search cases
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
            minWidth: '300px',
            maxWidth: '80%',
            animation: 'fadeInUp 0.3s ease-out forwards',
          }}
        >
          <div className="flex items-center justify-center w-full">
            <svg className={commonStyles.notification.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={commonStyles.notification.message}>{errorNotification.message}</span>
          </div>
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
