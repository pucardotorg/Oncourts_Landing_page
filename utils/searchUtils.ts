import { ApiResponse, FormState } from "../types/search";
import { newCaseSearchConfig } from "../data/newCaseSearchConfig";
import { transformSearchResponse } from "../TransformData/transformSearchData";

/**
 * Format date from timestamp to readable format
 */
export const formatDate = (timestamp: number | null | undefined): string => {
  if (!timestamp) return "Not Available";
  return new Date(timestamp).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
};

/**
 * Fetch case data from API with error handling
 */
export const fetchCase = async (url: string): Promise<ApiResponse | null> => {
  try {
    // Show messages in development but not in production
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) console.log(`Fetching data from: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API response error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching case data:", (error as Error).message);
    return null;
  }
};

/**
 * Build API URL based on search parameters and selected tab
 */
export const buildApiUrl = (
  selectedTab: string,
  params: Partial<FormState> & { offset?: number; limit?: number }
): string => {
  const {
    cnrNumber,
    selectedYear,
    selectedCaseType,
    caseNumber,
    selectedCourt,
    code,
    barCode,
    advocateSearchMethod,
    advocateName,
    litigantName,
    offset = 0,
    limit = 10,
  } = params;

  const baseUrl = "/api/case";

  // Use a more modern approach with a map of URL builders for each tab
  const urlBuilders = {
    "CNR Number": () => (cnrNumber ? `${baseUrl}/cnr/${cnrNumber}` : ""),
    "Case Number": () => {
      if (selectedYear && selectedCaseType && caseNumber) {
        const caseNumberParts = caseNumber.split("/");
        if (caseNumberParts.length > 1) {
          return `${baseUrl}/${selectedYear}/${selectedCaseType}/${caseNumberParts[1]}`;
        }
      }
      return "";
    },
    "Filing Number": () =>
      selectedYear && selectedCourt && code
        ? `${baseUrl}/${selectedYear}/${selectedCourt}/${code}`
        : "",
    Advocate: () => {
      if (advocateSearchMethod === "Bar Code" && barCode) {
        return `${baseUrl}/advocate/barcode/${barCode}`;
      } else if (advocateSearchMethod === "Advocate Name" && advocateName) {
        return `${baseUrl}/advocate/name/${advocateName}`;
      }
      return "";
    },
    Litigant: () => (litigantName ? `${baseUrl}/litigant/${litigantName}` : ""),
    All: () =>
      `${baseUrl}/${selectedYear || "2025"}/${selectedCaseType || "CMP"}?offset=${offset}&limit=${limit}`,
  };

  // Get the appropriate URL builder function for the selected tab
  const builderFn = urlBuilders[selectedTab as keyof typeof urlBuilders];
  return builderFn ? builderFn() : "";
};

/**
 * Search for cases with the given parameters
 */
export const searchCases = async (
  selectedTab: string,
  params: Partial<FormState> & { offset?: number; limit?: number }
) => {
  try {
    const url = buildApiUrl(selectedTab, params);
    if (!url) return { results: [], totalCount: 0, error: null };

    const response = await fetchCase(url);
    
    if (!response) {
      return {
        results: [],
        totalCount: 0,
        error: {
          message: "Failed to fetch data. Please try again.",
          code: "API_ERROR"
        }
      };
    }
    
    const transformedData = transformSearchResponse(response, selectedTab);
    
    // Return successful response with null error
    return { 
      ...transformedData,
      error: null 
    };
    
  } catch (error) {
    console.error('Error in searchCases:', error);
    return { 
      results: [],
      totalCount: 0,
      error: {
        message: (error as Error).message || "An unexpected error occurred",
        code: "UNEXPECTED_ERROR"
      }
    };
  }
};

/**
 * Get tab configuration from case search config
 */
export const getTabConfig = (selectedTab: string) => {
  const tabConfigs = {
    "CNR Number": newCaseSearchConfig.cnrNumber,
    "Case Number": newCaseSearchConfig.caseNumber,
    "Filing Number": newCaseSearchConfig.filingNumber,
    Advocate: newCaseSearchConfig.advocate,
    Litigant: newCaseSearchConfig.litigant,
    All: newCaseSearchConfig.all,
  };

  return tabConfigs[selectedTab as keyof typeof tabConfigs] || {};
};

/**
 * Validate form based on selected tab
 */
export const isFormValid = (
  selectedTab: string,
  formState: Partial<FormState>
): boolean => {
  const {
    cnrNumber,
    caseNumber,
    selectedYear,
    selectedCourt,
    selectedCaseType,
    code,
    advocateSearchMethod,
    advocateName,
    barCode,
    litigantName,
  } = formState;

  const cnrNumberPattern = new RegExp(newCaseSearchConfig.cnrNumber.pattern);
  const caseNumberPattern = new RegExp(newCaseSearchConfig.caseNumber.pattern);

  switch (selectedTab) {
    case "CNR Number":
      return cnrNumberPattern.test(cnrNumber || "");
    case "Case Number":
      return (
        !!caseNumber &&
        caseNumberPattern.test(caseNumber) &&
        !!selectedCourt &&
        !!selectedCaseType &&
        !!selectedYear &&
        caseNumber?.includes(selectedCaseType) &&
        caseNumber?.includes(selectedYear)
      );
    case "Filing Number":
      return !!selectedCourt && !!code && !!selectedYear;
    case "Advocate":
      return advocateSearchMethod === "Bar Code"
        ? !!barCode && !!code && !!selectedYear
        : !!advocateName;
    case "Litigant":
      return !!litigantName;
    case "All":
      return true;
    default:
      return false;
  }
};
