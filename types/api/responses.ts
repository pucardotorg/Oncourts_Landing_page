/**
 * API response types for the case search API
 */

// Case item interface from API responses
export interface CaseItem {
  caseTitle?: string;
  caseNumber?: string;
  nextHearingDate?: number;
  purpose?: string;
  advocateComplainant?: string;
  filingNumber?: string;
  registrationNumber?: string;
  registrationDate?: number;
  subStage?: string;
}

// API response interface for case search endpoints
export interface ApiResponse {
  caseList?: CaseItem[];
  caseSummary?: CaseItem;
  pagination?: {
    totalCount: number;
  };
}

// API error interface
export interface ApiError {
  message: string;
  code: string;
}

// Search results interface with error handling
export interface SearchResult {
  results: CaseItem[];
  totalCount: number;
  error: ApiError | null;
}
