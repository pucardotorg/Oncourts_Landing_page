import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINTS } from "../../../lib/config";

/**
 * POST /api/payment/getReceipt
 *
 * Proxies payment receipt retrieval to the backend.
 * Query params (billId, tenantId) are forwarded as-is.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Method not allowed. Only POST is supported." });
  }

  // Forward query params to the backend URL
  const qs = new URLSearchParams(req.query as Record<string, string>).toString();
  const url = qs
    ? `${API_ENDPOINTS.PAYMENT.GET_RECEIPT}?${qs}`
    : API_ENDPOINTS.PAYMENT.GET_RECEIPT;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    if (!response?.ok) {
      return res.status(response?.status).json({
        error: `API error: ${response?.status}`,
        message: await response?.text(),
      });
    }

    const data = await response?.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in getReceipt API:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error)?.message,
    });
  }
}
