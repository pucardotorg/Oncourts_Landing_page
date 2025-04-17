export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://oncourts.kerala.gov.in/egov-mdms-service/v1/_search?tenantId=kl",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          MdmsCriteria: {
            tenantId: "kl",
            moduleDetails: [
              {
                moduleName: "LandingPage",
                masterDetails: [{ name: "DashboardMeterics" }],
              },
            ],
          },
          RequestInfo: {
            apiId: "Rainmaker",
            msgId: `${Date.now()}|en_IN`,
            plainAccessRequest: {},
          },
        }),
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in proxy:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
