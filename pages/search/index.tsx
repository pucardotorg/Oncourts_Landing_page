import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const SearchForCase = () => {
  const [selectedButton, setSelectedButton] = useState("CNR");
  const [caseNumber, setCaseNumber] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCaseType, setSelectedCaseType] = useState("");
  const router = useRouter();

  useEffect(() => {
    setSelectedCaseType("CMP")
    setSelectedYear("2024")
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
    setSelectedCaseType("CMP");
  };

  async function searchCaseSummary(caseNumber, selectedCaseType, selectedYear) {
    const queryParams: {
      caseNumber?: string;
      selectedCaseType?: string;
      selectedYear?: string;
      selectedButton?: string
    } = {};

    if (caseNumber) queryParams.caseNumber = caseNumber;
    if (selectedCaseType) queryParams.selectedCaseType = selectedCaseType;
    if (selectedYear) queryParams.selectedYear = selectedYear;
    if (selectedButton) queryParams.selectedButton = selectedButton;

    router.push({
      pathname: "/casedetails",
      query: queryParams,
    });


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
                  placeholder="Example : KLKM520000452024"
                  className="w-full py-2 px-4 rounded-2xl outline-none bg-transparent"
                />
              </div>
            </div>
          </>
        )}

        {selectedButton === "CaseNumber" && (
          <>
            <div className="mb-4">
              <label htmlFor="caseType" className="text-teal font-medium text-sm">
                Select Case Type <span className="text-red-500">*</span>
              </label>
              <div className="w-full rounded-2xl border border-teal p-4 mt-2">
                <select
                  id="caseType"
                  value={selectedCaseType}
                  onChange={(e) => setSelectedCaseType(e.target.value)}
                  className="w-full py-2 px-4 rounded-2xl outline-none bg-transparent"
                  required
                >
                  {/* <option value="">Select Case Type</option> */}
                  <option value="CMP">CMP</option>
                  <option value="ST">ST</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex flex-wrap justify-between space-x-4">
                {/* Case Number Input */}
                <div >
                  <div className="flex items-center space-x-1">
                    <label htmlFor="caseNumberInput" className="text-teal font-medium text-sm">
                      Enter Case Number
                    </label>
                  </div>
                  <div className="rounded-2xl border border-teal p-2 mt-1">
                    <input
                      type="text"
                      id="caseNumberInput"
                      value={caseNumber}
                      onChange={(e) => setCaseNumber(e.target.value)}
                      placeholder={
                        selectedCaseType === "CMP"
                          ? "Example: CMP/15/2024"
                          : "Example: ST/15/2024"
                      }
                      className="w-full py-2 px-4 rounded-2xl outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Select Year Input */}
                <div className="w-full md:w-1/2">
                  <div className="flex items-center space-x-1">
                    <label htmlFor="yearInput" className="text-teal font-medium text-sm">
                      Select Year
                    </label>
                    <span className="text-red-500 text-sm">*</span>
                  </div>
                  <div className="rounded-2xl border border-teal p-2 mt-1">
                    <select
                      id="yearInput"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full py-2 px-4 rounded-2xl outline-none bg-transparent"
                      required
                    >
                      <option value="2024">2024</option>
                      {/* Uncomment other options if needed */}
                      {/* <option value="2023">2023</option> */}
                      {/* <option value="2022">2022</option> */}
                    </select>
                  </div>
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
            onClick={() => searchCaseSummary(caseNumber, selectedCaseType, selectedYear)}
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
