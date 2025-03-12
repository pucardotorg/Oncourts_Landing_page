export default async function handler(req, res) {
  const { year, type, caseNumber } = req.query;
  const url = `https://oncourts.kerala.gov.in/openapi/v1/kl/case/${year}/${type}/${caseNumber}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Internal Server Error" });
  }
}
