import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const SearchForCase = () => {
  const [selectedButton, setSelectedButton] = useState("CNR");
  const [caseNumber, setCaseNumber] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCaseType, setSelectedCaseType] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (router.query.type) {
      setSelectedButton(
        Array.isArray(router.query.type)
          ? router.query.type[0]
          : router.query.type,
      );
    }
  }, [router.query]);

  const handleButtonClick = (buttonType) => {
    setSelectedButton(buttonType);
    router.push(`/search?type=${buttonType}`, undefined, { shallow: true });
  };

  const handleClear = () => {
    setCaseNumber("");
    setSelectedYear("");
    setSelectedCaseType("");
  };

  async function searchCaseSummary(value) {
    const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const url = `${API_ENDPOINT}/case/v1/search/_summary`;
    let requestBody;
    if (selectedButton == "CNR") {
      requestBody = {
        RequestInfo: {
          authToken: `${process.env.AUTH_TOKEN_SEARCH}`,
        },
        tenantId: "kl",
        criteria: {
          tenantId: "kl",
          caseId: null,
          cnrNumber: [value],
        },
      };
    } else {
      requestBody = {
        RequestInfo: {
          authToken: `${process.env.AUTH_TOKEN_SEARCH}`,
        },
        tenantId: "kl",
        criteria: {
          tenantId: "kl",
          caseId: [value],
          cnrNumber: null,
        },
      };
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const caseData = data.cases[0];
      router.push({
        pathname: "/casedetails",
        query: { data: JSON.stringify(caseData) },
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <h2 className="text-teal font-bold text-3xl mb-4 text-center">
        Search for a Case
      </h2>
      <div className="mx-8">
        <div className="flex border-2 border-teal rounded-xl mb-6 p-2">
          <button
            onClick={() => handleButtonClick("CNR")}
            className={`flex-1 py-2 px-2 text-center rounded-sm ${selectedButton === "CNR" ? "bg-teal text-white" : "text-teal"} border-r-2 border-teal`}
          >
            Case Number Record (CNR)
          </button>
          <button
            onClick={() => handleButtonClick("CaseNumber")}
            className={`flex-1 py-2 text-center rounded-sm ${selectedButton === "CaseNumber" ? "bg-teal text-white" : "text-teal"}`}
          >
            Case Number
          </button>
        </div>
      </div>

      <div className="p-6 rounded-2xl shadow-md">
        {selectedButton === "CNR" && (
          <>
            <div className="mb-4">
              <label
                htmlFor="cnrInput"
                className="text-teal font-medium text-sm"
              >
                Enter CNR Number
              </label>
              <div className="rounded-xl border-2 border-teal p-2 mt-2">
                <input
                  type="text"
                  id="cnrInput"
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  placeholder="For example : MHAU02153654478"
                  className="w-full py-2 px-4 rounded-2xl outline-none bg-transparent"
                />
              </div>
            </div>
          </>
        )}

        {selectedButton === "CaseNumber" && (
          <>
            <div className="mb-4">
              <label
                htmlFor="caseType"
                className="text-teal font-medium text-sm"
              >
                Select Case Type
              </label>
              <div className="w-full rounded-2xl border border-teal p-4 mt-2">
                <select
                  id="caseType"
                  value={selectedCaseType}
                  onChange={(e) => setSelectedCaseType(e.target.value)}
                  className="w-full py-2 px-4 rounded-2xl outline-none bg-transparent"
                >
                  <option value="">Select Case Type</option>
                  <option value="Type1">Type 1</option>
                  <option value="Type2">Type 2</option>
                  <option value="Type3">Type 3</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="caseNumberInput"
                className="text-teal font-medium text-sm"
              >
                Enter Case Number
              </label>
              <div className="flex space-x-4 mt-2">
                <div className="w-1/2 rounded-2xl border border-teal p-4">
                  <input
                    type="text"
                    id="caseNumberInput"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    placeholder="For example : 02153654478"
                    className="w-full py-2 px-4 rounded-2xl outline-none bg-transparent"
                  />
                </div>
                <div className="w-1/2 rounded-2xl border border-teal p-4 bg-transparent">
                  <select
                    id="yearInput"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full py-2 px-4 rounded-2xl outline-none bg-transparent"
                  >
                    <option value="">Select Year</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="flex justify-around mx-28">
          <button
            onClick={handleClear}
            className="py-2 px-6 rounded-2xl border border-teal text-teal"
          >
            Clear Response
          </button>
          <button
            onClick={() => searchCaseSummary(caseNumber)}
            className="py-2 px-6 rounded-2xl bg-teal text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchForCase;
