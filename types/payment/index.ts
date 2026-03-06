// ─── Payment Data Models ─────────────────────────────────────────────────────

export interface FetchBillCriteria {
  consumerCode: string[];
  tenantId: string;
  businessService: string;
}

export interface SearchBillCriteria {
  tenantId: string;
  consumerCode: string[];
  service: string;
}

export interface BillDetail {
  id: string;
  billId: string;
  additionalDetails?: {
    payerMobileNo?: string;
    payer?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface Bill {
  consumerCode: string;
  businessService: string;
  status: string;
  billDetails: BillDetail[];
  [key: string]: unknown;
}

export interface BillResponse {
  Bill: Bill[];
}

export interface ChallanPayload {
  url: string;
  data: string;
  headers: string;
  grn: string;
}

export interface ETreasuryResponse {
  payload: ChallanPayload;
}

export interface PaymentReceiptResponse {
  Document?: {
    fileStore?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
