import { API_ENDPOINTS } from "../../lib/config";

export default async function handler(req, res) {
  try {
    const { tenantId, fromDate, toDate, searchText } = req.body;

    const payload = {
      tenantId: tenantId,
      fromDate: fromDate,
      toDate: toDate,
      searchText: searchText,
    };
    const response = await fetch(API_ENDPOINTS.OPENAPI.HEARING, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in proxy:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
