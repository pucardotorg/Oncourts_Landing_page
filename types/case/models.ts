/**
 * Case model interfaces representing court case data
 */

// Case result interface for consistent typing in frontend displays
export interface CaseResult {
  caseTitle: string;
  caseNumber: string;
  nextHearingDate: string;
  purpose: string;
  filingNumber?: string;
  courtId?: string;
}
