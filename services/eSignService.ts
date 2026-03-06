import type { ESignRequestData, ESignResponseData } from "../types";

/**
 * Calls the Next.js /api/esign proxy, which forwards the request to the
 * backend openapi esign endpoint.
 *
 * This replaces `Digit.DRISTIService.eSignOpenService`.
 */
export async function eSignOpenService(
  data: ESignRequestData,
  params?: Record<string, string>,
): Promise<ESignResponseData> {
  const queryString = params
    ? "?" + new URLSearchParams(params).toString()
    : "";
  const response = await fetch(`/api/esign${queryString}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`eSign request failed [${response.status}]: ${errorBody}`);
  }

  return response.json();
}
