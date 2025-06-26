/**
 * Case model interfaces representing court case data
 */

export interface PartyInfo {
  id?: string;
  name?: string;
  entityType?: string;
}
export interface CaseResult {
  caseTitle?: string;
  cmpNumber?: string;
  stNumber?: string;
  purpose?: string;
  nextHearingDate?: string;
  lastHearingDate?: string;
  filingDate?: string;
  registrationDate?: string;
  filingNumber?: string;
  courtId?: string;
  courtName?: string;
  cnrNumber?: string;
  caseStage?: string;
  advocates?: PartyInfo[];
  litigants?: PartyInfo[];
}

export interface CourtRoom {
  code?: string;
  name?: string;
  establishment?: string;
}
