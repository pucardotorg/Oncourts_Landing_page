// ─── eSign Data Models ───────────────────────────────────────────────────────

export interface ESignRequestData {
  fileStoreId: string;
  tenantId: string;
  pageModule: string;
  signPlaceHolder?: string;
}

export interface ESignResponseData {
  ESignForm?: {
    eSignRequest: string;
    aspTxnID: string;
  };
  [key: string]: unknown;
}
