import React, { useMemo } from "react";
import CNRNumberForm from "./forms/CNRNumberForm";
import CaseNumberForm from "./forms/CaseNumberForm";
import AdvocateForm from "./forms/AdvocateForm";
import LitigantForm from "./forms/LitigantForm";
import FilingNumberForm from "./forms/FilingNumberForm";
import AllForm from "./forms/AllForm";

interface FormState {
  caseNumber: string;
  selectedYear: string;
  selectedCourt: string;
  selectedCaseType: string;
  code: string;
  cnrNumber: string;
  advocateSearchMethod: string;
  barCode: string;
  advocateName: string;
  litigantName: string;
  handleClear: () => void;
  handleSubmit: () => void;
}

interface SearchFormProps {
  selectedTab: string;
  formState: FormState;
  handleInputChange: (field: string, value: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  selectedTab,
  formState,
  handleInputChange,
}) => {
  const caseNumberPattern = /^[A-Z]+\/\d*\/\d{4}$/;
  const cnrNumberPattern = /^[A-Z]{4}\d{12}$/;

  // Determine if form is valid based on the selected tab
  const isFormValid = useMemo(() => {
    switch (selectedTab) {
      case "CNR Number":
        return (
          cnrNumberPattern.test(formState.cnrNumber) && !!formState.cnrNumber
        );

      case "Advocate":
        if (formState.advocateSearchMethod === "Bar Code") {
          return (
            !!formState.code && !!formState.barCode && !!formState.selectedYear
          );
        } else {
          return !!formState.advocateName;
        }

      case "Litigant":
        return !!formState.litigantName;

      case "Filing Number":
        return (
          !!formState.selectedCourt &&
          !!formState.code &&
          !!formState.caseNumber &&
          !!formState.selectedYear
        );

      case "Case Number":
        return (
          caseNumberPattern.test(formState.caseNumber) &&
          !!formState.selectedCourt &&
          !!formState.selectedCaseType &&
          !!formState.caseNumber &&
          !!formState.selectedYear
        );

      case "All":
        return (
          !!formState.selectedCourt &&
          !!formState.selectedCaseType &&
          !!formState.caseNumber &&
          !!formState.selectedYear
        );

      default:
        return false;
    }
  }, [selectedTab, formState, caseNumberPattern, cnrNumberPattern]);
  return (
    <div className="p-6 bg-white rounded-lg border-2 border-[#E2E8F0] rounded-b-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {selectedTab === "CNR Number" && (
          <CNRNumberForm
            cnrNumber={formState.cnrNumber}
            onChange={(value) => handleInputChange("cnrNumber", value)}
          />
        )}

        {selectedTab === "Advocate" && (
          <AdvocateForm
            advocateSearchMethod={formState.advocateSearchMethod}
            barCode={formState.barCode}
            code={formState.code}
            selectedYear={formState.selectedYear}
            advocateName={formState.advocateName}
            onMethodChange={(value) =>
              handleInputChange("advocateSearchMethod", value)
            }
            onBarCodeChange={(value) => handleInputChange("barCode", value)}
            onCodeChange={(value) => handleInputChange("code", value)}
            onYearChange={(value) => handleInputChange("selectedYear", value)}
            onNameChange={(value) => handleInputChange("advocateName", value)}
          />
        )}

        {selectedTab === "Litigant" && (
          <LitigantForm
            litigantName={formState.litigantName}
            onChange={(value) => handleInputChange("litigantName", value)}
          />
        )}

        {selectedTab === "Filing Number" && (
          <FilingNumberForm
            selectedCourt={formState.selectedCourt}
            code={formState.code}
            caseNumber={formState.caseNumber}
            selectedYear={formState.selectedYear}
            onCourtChange={(value) => handleInputChange("selectedCourt", value)}
            onCodeChange={(value) => handleInputChange("code", value)}
            onCaseNumberChange={(value) =>
              handleInputChange("caseNumber", value)
            }
            onYearChange={(value) => handleInputChange("selectedYear", value)}
          />
        )}

        {selectedTab === "Case Number" && (
          <CaseNumberForm
            selectedCourt={formState.selectedCourt}
            selectedCaseType={formState.selectedCaseType}
            caseNumber={formState.caseNumber}
            selectedYear={formState.selectedYear}
            onCourtChange={(value) => handleInputChange("selectedCourt", value)}
            onCaseTypeChange={(value) =>
              handleInputChange("selectedCaseType", value)
            }
            onCaseNumberChange={(value) =>
              handleInputChange("caseNumber", value)
            }
            onYearChange={(value) => handleInputChange("selectedYear", value)}
          />
        )}

        {selectedTab === "All" && (
          <AllForm
            selectedCourt={formState.selectedCourt}
            selectedCaseType={formState.selectedCaseType}
            caseNumber={formState.caseNumber}
            selectedYear={formState.selectedYear}
            onCourtChange={(value) => handleInputChange("selectedCourt", value)}
            onCaseTypeChange={(value) =>
              handleInputChange("selectedCaseType", value)
            }
            onCaseNumberChange={(value) =>
              handleInputChange("caseNumber", value)
            }
            onYearChange={(value) => handleInputChange("selectedYear", value)}
          />
        )}
      </div>

      {/* Horizontal line break */}
      <hr className="my-6 border-t border-gray-200" />

      {/* Action Buttons */}
      <div className="flex justify-end col-span-full md:col-span-2 lg:col-span-4 gap-4">
        <button
          onClick={formState.handleClear}
          className="px-28 py-2 border border-gray-300 rounded-md text-lg font-medium text-gray-700 hover:bg-gray-50 bg-white"
        >
          Clear
        </button>
        <button
          onClick={formState.handleSubmit}
          disabled={!isFormValid}
          className={`
            px-20 py-2 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-[#0F766E] focus:outline-none ${isFormValid ? "hover:bg-teal-700" : "opacity-50 cursor-not-allowed pointer-events-none"}
          `}
        >
          Search Case
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
