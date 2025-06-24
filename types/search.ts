/**
 * Type definitions for search functionality
 */

// Case result interface for consistent typing
export interface CaseResult {
  caseTitle: string;
  caseNumber: string;
  nextHearingDate: string;
  purpose: string;
  filingNumber?: string;
  courtId?: string;
}

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

// Form state interface
export interface FormState {
  caseNumber: string;
  selectedYear: string;
  selectedCourt: string;
  selectedCaseType: string;
  code: string;
  cnrNumber: string;
  advocateSearchMethod: string;
  barCode: string;
  advocateName: string;
  litigantName: string;
}

// Filter state interface
export interface FilterState {
  courtName: string;
  caseType: string;
  hearingDateFrom: string;
  hearingDateTo: string;
  filingYear: string;
  caseStage: string;
  caseStatus: string;
}

// API response interface
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
  results: CaseResult[];
  totalCount: number;
  error: ApiError | null;
}

export interface OrderDetails {
  date: number; // Unix timestamp
  businessOfTheDay: string;
}

export interface PaymentTask {
  id: string;
  task: string;
  dueDate: string;
  daysRemaining: string;
}

export interface InboxSearchResponse {
  paymentTasks: PaymentTask[];
  orderDetailsList: OrderDetails[];
  totalCount: number;
}
