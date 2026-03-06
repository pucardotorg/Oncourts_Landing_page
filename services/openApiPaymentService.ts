/**
 * Service layer for the Open-API payment endpoints.
 *
 * All calls go through the Next.js rewrite proxy:
 *   /api/openapi/:path*  →  <backend>/openapi/:path*
 */

import type {
  FetchBillCriteria,
  SearchBillCriteria,
  BillResponse,
  ETreasuryResponse,
  PaymentReceiptResponse,
} from "../types";

// ─── Request helper ──────────────────────────────────────────────────────────

async function request<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "*/*" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${url} failed [${res.status}]: ${text}`);
  }

  return res.json();
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** POST /api/payment/fetchBill */
export function callFetchBill(criteria: FetchBillCriteria) {
  return request<BillResponse>("/api/payment/fetchBill", {
    Criteria: criteria,
  });
}

/** POST /api/payment/processChallan */
export function callETreasury(challanData: Record<string, unknown>) {
  return request<ETreasuryResponse>("/api/payment/processChallan", {
    ChallanData: challanData,
  });
}

/** POST /api/payment/searchBill */
export function callSearchBill(criteria: SearchBillCriteria) {
  return request<BillResponse>("/api/payment/searchBill", {
    Criteria: criteria,
  });
}

// ─── Payment receipt ─────────────────────────────────────────────────────────

/** POST /api/payment/getReceipt */
export function fetchBillFileStoreId(params: {
  billId: string;
  tenantId: string;
}) {
  const qs = new URLSearchParams(params).toString();
  return request<PaymentReceiptResponse>(
    `/api/payment/getReceipt?${qs}`,
    {},
  );
}
