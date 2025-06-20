import { ApiResponse, CaseItem, CaseResult, SearchResult } from "../types/search";
import { formatDate } from "../utils/searchUtils";

/**
 * Transform API response to standardized search results
 */
export function transformSearchResponse(
  response: ApiResponse | null,
  selectedTab: string
): SearchResult {
  if (!response) {
    return { results: [], totalCount: 0, error: null };
  }

  // Extract pagination information
  const totalCount = response.pagination?.totalCount || 0;
  let results: CaseResult[] = [];

  // Handle different response formats based on search type
  if (selectedTab === "All" && response.caseList) {
    results = transformCaseListResponse(response.caseList);
  } else if (response.caseSummary) {
    results = [transformCaseSummaryResponse(response.caseSummary)];
  }

  return { results, totalCount, error: null };
}

/**
 * Transform case list to standardized format
 */
function transformCaseListResponse(caseList: CaseItem[]): CaseResult[] {
  return caseList.map((caseItem) => ({
    caseTitle: caseItem.caseTitle || "Not Available",
    caseNumber: caseItem.caseNumber || "Not Available",
    nextHearingDate: caseItem.nextHearingDate 
      ? formatDate(caseItem.nextHearingDate) 
      : "Not Available",
    purpose: caseItem.purpose || "Not Available",
  }));
}

/**
 * Transform single case summary to standardized format
 */
function transformCaseSummaryResponse(caseSummary: CaseItem): CaseResult {
  return {
    caseTitle: caseSummary.advocateComplainant || "Not Available",
    caseNumber: 
      caseSummary.filingNumber || 
      caseSummary.registrationNumber || 
      "Not Available",
    nextHearingDate: formatDate(caseSummary.registrationDate),
    purpose: caseSummary.subStage || "Not Available",
  };
}
