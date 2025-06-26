import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINTS } from "../../../lib/config";

type MagistrateNameParams = {
  tenantId: string;
  courtId: string;
};

/**
 * API handler for fetching magistrate names
 * Forwards the request to the backend API with proper parameters
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests for this endpoint
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: "Method not allowed. Use GET instead." });
  }

  try {
    // Extract query parameters
    const { tenantId, courtId } = req.query as MagistrateNameParams;

    // Validate required parameters
    if (!courtId) {
      return res.status(400).json({ error: "courtId is required" });
    }

    // Make the request to the backend API
    const response = await fetch(
      API_ENDPOINTS.OPENAPI.MAGISTRATE(tenantId, courtId),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Accept: "application/json",
        },
      }
    );

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        error: "Error fetching magistrate data",
        details: errorData,
      });
    }

    // Return the response from the backend API
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Magistrate fetch error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
