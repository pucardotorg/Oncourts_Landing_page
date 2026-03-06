// ─── CTC Service — API calls for Certified True Copy flow ────────────────────

import type {
  CaseBundleNode,
  CtcApplication,
  ValidateUserInfo,
  Pagination,
  CtcSearchCriteria,
} from "../types";

// ─── Response types ──────────────────────────────────────────────────────────

interface CtcApplicationResponse {
  ResponseInfo?: Record<string, unknown>;
  ctcApplication?: CtcApplication;
}

interface CtcSearchResponse {
  ResponseInfo?: Record<string, unknown>;
  ctcApplications?: CtcApplication[];
  totalCount?: number;
}

interface ValidateUserResponse {
  ResponseInfo?: Record<string, unknown>;
  validateUserInfo?: ValidateUserInfo;
}

interface DocPreviewResponse {
  responseInfo?: Record<string, unknown>;
  caseBundleNodes?: CaseBundleNode[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildRequestInfo() {
  return {
    apiId: "Rainmaker",
    msgId: `${Date.now()}|en_IN`,
  };
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res?.ok) {
    const text = await res?.text().catch(() => "");
    throw new Error(`API ${url} failed (${res?.status}): ${text}`);
  }
  return res?.json();
}

// ─── CTC Application APIs (via Next.js API routes) ──────────────────────────

/** POST /api/ctc/create */
export async function createCtcApplication(
  application: CtcApplication,
): Promise<CtcApplicationResponse> {
  return post<CtcApplicationResponse>("/api/ctc/create", {
    RequestInfo: buildRequestInfo(),
    CtcApplication: application,
  });
}

/** POST /api/ctc/update */
export async function updateCtcApplication(
  application: CtcApplication,
): Promise<CtcApplicationResponse> {
  return post<CtcApplicationResponse>("/api/ctc/update", {
    RequestInfo: buildRequestInfo(),
    CtcApplication: application,
  });
}

/** POST /api/ctc/search */
export async function searchCtcApplications(
  criteria: CtcSearchCriteria,
  pagination?: Pagination,
): Promise<CtcSearchResponse> {
  return post<CtcSearchResponse>("/api/ctc/search", {
    RequestInfo: buildRequestInfo(),
    criteria,
    pagination,
  });
}

/** POST /api/ctc/validate */
export async function validateUser(params: {
  filingNumber: string;
  mobileNumber: string;
  tenantId: string;
  courtId: string;
}): Promise<ValidateUserResponse> {
  return post<ValidateUserResponse>("/api/ctc/validate", {
    RequestInfo: buildRequestInfo(),
    ...params,
  });
}

// ─── Document Preview API (via Next.js API route) ────────────────────────────

/** POST /api/ctc/preview-doc */
export async function previewDoc(params: {
  filingNumber: string;
  ctcApplicationNumber?: string;
  courtId: string;
  caseBundleNode?: CaseBundleNode[];
}): Promise<DocPreviewResponse> {
  return post<DocPreviewResponse>("/api/ctc/preview-doc", {
    RequestInfo: buildRequestInfo(),
    ...params,
  });
}
