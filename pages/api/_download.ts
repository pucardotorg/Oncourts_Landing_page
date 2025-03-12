export default async function handler(req, res) {

  const { tenantId, Criteria } = req.body;
  if (!tenantId || !Criteria) {
    return res.status(400).json({ error: 'Missing required parameters: tenantId and Criteria are required' });
  }
  const url = `https://oncourts.kerala.gov.in/scheduler/causelist/v1/_download`;
  try {
    const response = await fetch(url,
      {
        method: "POST",
        headers: {
          Accept: "application/json,text/plain, */*",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({ tenantId, Criteria }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching case: ${response.statusText}`);
    }
    const pdfBuffer = await response.arrayBuffer();

    // Set headers for file download
    res.setHeader("Content-Disposition", "attachment; filename=causelist.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Cache-Control", "no-store, max-age=0");

    return res.status(200).send(Buffer.from(pdfBuffer));
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Internal Server Error" });
  }
}
