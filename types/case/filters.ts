/**
 * Filter related types for case search
 */

// Filter state interface used in UI components
export interface FilterState {
  courtName: string;
  caseType: string;
  hearingDateFrom: string;
  hearingDateTo: string;
  caseStage: string;
  caseStatus: string;
  yearOfFiling: string;
  caseTitle: string;
}
