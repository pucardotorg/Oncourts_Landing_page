import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SingleCase from "./single_case";
import MultipleCase from "./multiple_case";

async function fetchCase(url: string) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log("Error fetching case summary:", (error as Error).message);
    return null;
  }
}

function CaseDetails() {
  const [data, setData] = useState(null);
  const [cases, setCases] = useState([]);
  const [multipleCase, setMultipleCase] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { caseNumber, selectedCaseType, selectedYear, selectedButton } = router.query;

  useEffect(() => {
    async function searchCaseSummary() {
      setLoading(true);

      let url = "";
      if (selectedButton === "CNR") {
        url = `/api/case/cnr/${caseNumber}`;
      } else {
        if (!caseNumber) {
          setMultipleCase(true);
          url = `/api/case/${selectedYear}/${selectedCaseType}`;
        } else {
          url = `/api/case/${selectedYear}/${selectedCaseType}/${caseNumber}`;
        }
      }

      const res = await fetchCase(url);
      if (res) {
        if (selectedButton === "CNR" || caseNumber) {
          setData(res["caseSummary"]);
        } else {
          setCases(res["caseList"]);
        }
      }
      setLoading(false);
    }

    searchCaseSummary();
  }, [caseNumber, selectedButton, selectedCaseType, selectedYear]);

  useEffect(() => {
    if (!loading && !data && cases.length === 0) {
      router.push("/search");
    }
  }, [loading, data, cases, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {!multipleCase && data ? (
        <SingleCase data={data} />
      ) : multipleCase && cases.length > 0 ? (
        <MultipleCase data={cases} />
      ) : null}
    </div>
  );
}

export default CaseDetails;