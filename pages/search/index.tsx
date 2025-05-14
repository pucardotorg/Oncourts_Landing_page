import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { caseSearchConfig } from "../../data/caseSearchConfig";
import SubmitButtons from "../../components/CaseSearch/SubmitButtons";
import CaseNumberForm from "../../components/CaseSearch/CaseNumberForm";
import CNRForm from "../../components/CaseSearch/CNRForm";

const SearchForCase = () => {
  const [selectedButton, setSelectedButton] = useState("CNR");
  // caseNumber is used for both CNR and Case Number -- can be seperated if needed
  const [caseNumber, setCaseNumber] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCaseType, setSelectedCaseType] = useState("");
  const router = useRouter();

  const caseNumberPattern = /^[A-Z]+\/\d*\/\d{4}$/;
  const isValidCaseNumber =
    selectedButton === "CNR" ? caseNumber.trim() !== "" : caseNumber === "" || caseNumberPattern.test(caseNumber);
  // const isSubmitDisabled = !isValidCaseNumber || (selectedButton === "CaseNumber" && (selectedCaseType === "" || selectedYear === ""));
  const isSubmitDisabled = !isValidCaseNumber;

  const handleButtonClick = (buttonType) => {
    setCaseNumber("");
    setSelectedButton(buttonType);
  };

  const handleClear = () => {
    setCaseNumber("");
    setSelectedYear("");
    setSelectedCaseType("");
  };

  async function searchCaseSummary(caseNumber, selectedCaseType, selectedYear) {
    const queryParams: {
      caseNumber?: string;
      selectedCaseType?: string;
      selectedYear?: string;
      selectedButton?: string
    } = {};

    if (caseNumber) {
      if (caseNumber.includes("/")) {
        queryParams.caseNumber = caseNumber.split("/")[1];
        queryParams.selectedCaseType = caseNumber.split("/")[0];
        queryParams.selectedYear = caseNumber.split("/")[2];
      } else {
        queryParams.caseNumber = caseNumber;
      }
    } else {
      if (selectedCaseType) queryParams.selectedCaseType = selectedCaseType;
      if (selectedYear) queryParams.selectedYear = selectedYear;
    }

    if (selectedButton) queryParams.selectedButton = selectedButton;

    router.push({
      pathname: "/casedetails",
      query: queryParams,
    });
  }

  const handleSubmit = () => {
    if (isSubmitDisabled) return;
    searchCaseSummary(caseNumber, selectedCaseType, selectedYear);
  };

  useEffect(() => {
    if (!router.isReady) return;
    const { selectedButton, caseNumber, selectedCaseType, selectedYear } = router.query;
    if (!selectedButton || !caseNumber) return;

    if (selectedButton) setSelectedButton(selectedButton as string);

    if (selectedButton === "CNR") setCaseNumber(caseNumber as string);
    else {
      if (selectedCaseType && selectedYear) {
        setSelectedCaseType(selectedCaseType as string);
        setSelectedYear(selectedYear as string);
        setCaseNumber(`${selectedCaseType}/${caseNumber}/${selectedYear}`);
      }
    }
  }, [router]);

  return (
    <div className="max-w-xl mx-auto py-8">
      <h2 className="text-teal font-bold text-3xl mb-4 text-center">
        {caseSearchConfig.heading}
      </h2>
      <div className="mx-8">
        <div className="flex border-2 border-teal rounded-xl mb-6 p-2">
          <button
            onClick={() => handleButtonClick("CNR")}
            className={`flex-1 py-2 px-2 text-center rounded-sm ${selectedButton === "CNR" ? "bg-teal text-white" : "text-teal"} border-r-2 border-teal`}
          >
            {caseSearchConfig.buttonLabels.cnr}
          </button>
          <button
            onClick={() => handleButtonClick("CaseNumber")}
            className={`flex-1 py-2 text-center rounded-sm ${selectedButton === "CaseNumber" ? "bg-teal text-white" : "text-teal"}`}
          >
            {caseSearchConfig.buttonLabels.caseNumber}
          </button>
        </div>
      </div>

      <div className="p-6 rounded-2xl shadow-md" tabIndex={0} onKeyDown={(e) => {
        if (e.key === 'Enter' && !isSubmitDisabled) {
          handleSubmit();
        }
      }}>
        {selectedButton === "CNR" && (
          <CNRForm
            caseNumber={caseNumber}
            setCaseNumber={setCaseNumber}
            config={caseSearchConfig.cnrInput}
          />
        )}
        {selectedButton === "CaseNumber" && (
          <CaseNumberForm
            caseNumber={caseNumber}
            setCaseNumber={setCaseNumber}
            selectedCaseType={selectedCaseType}
            setSelectedCaseType={setSelectedCaseType}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            config={caseSearchConfig.caseNumberSection}
          />
        )}
        <SubmitButtons
          handleClear={handleClear}
          handleSubmit={handleSubmit}
          isSubmitDisabled={isSubmitDisabled}
          config={caseSearchConfig.buttons}
        />
      </div>
    </div>
  );
};

export default SearchForCase;
