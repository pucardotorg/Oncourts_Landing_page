import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SingleCase from "./single_case";
import MultipleCase from "./multiple_case";

const CaseDetails = () => {
  const [data, setData] = useState(null);
  const [cases, setCases] = useState({});
  const [multipleCase, setMultipleCase] = useState(false);
  const [loading,setLoading]=useState(false)
  const router = useRouter();
  const { caseNumber, selectedCaseType, selectedYear, selectedButton } = router.query;

  async function searchCaseSummary() {
    setLoading(true);
    const API_ENDPOINT = "https://dristi-kerala-dev.pucar.org";
    const tenantID = "kl";
    let url;

    if (selectedButton === "CNR") {
      url = `${API_ENDPOINT}/openapi/v1/${tenantID}/case/cnr/${caseNumber}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json();
        const caseList = res["caseSummary"];
        setData(caseList);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      if (caseNumber === "" || caseNumber === null || caseNumber === undefined) {
        url = `${API_ENDPOINT}/openapi/v1/${tenantID}/case/${selectedYear}/${selectedCaseType}`;
        setMultipleCase(true);
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const res = await response.json();
          const caseList = await res["caseList"];
          setCases(caseList)
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        url = `${API_ENDPOINT}/openapi/v1/${tenantID}/case/${selectedYear}/${selectedCaseType}/${caseNumber}`;
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const res = await response.json();
          const caseList = res["caseSummary"];
          setData(caseList);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    searchCaseSummary();
  }, [caseNumber, selectedCaseType, selectedYear, selectedButton]);

  // if (!data) {
  //   return <p className="p-6">Loading...</p>;
  // }

  return (
    <div className="p-6">
      {!loading && !multipleCase && data && <SingleCase data={data} />}
      {!loading && multipleCase && cases && <MultipleCase data={cases} />}
    </div>
  );
};

export default CaseDetails;
