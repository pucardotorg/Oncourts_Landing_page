import React, { useEffect } from "react";
import CNRNumberForm from "./forms/CNRNumberForm";
import CaseNumberForm from "./forms/CaseNumberForm";
import AdvocateForm from "./forms/AdvocateForm";
import LitigantForm from "./forms/LitigantForm";
import FilingNumberForm from "./forms/FilingNumberForm";
import { newCaseSearchConfig } from "../../data/newCaseSearchConfig";
import { commonStyles } from "../../styles/commonStyles";
import { isFormValid } from "../../utils/searchUtils";
import { CourtRoom, FormState } from "../../types";

interface FormStateWithHandlers extends FormState {
  handleClear: () => void;
  handleSubmit: () => void;
}

interface SearchFormProps {
  t: (key: string) => string;
  selectedTab: string;
  formState: FormStateWithHandlers;
  handleInputChange: (field: string, value: string) => void;
  courtOptions: CourtRoom[];
}

const SearchForm: React.FC<SearchFormProps> = ({
  t,
  selectedTab,
  formState,
  handleInputChange,
  courtOptions,
}) => {
  // Get form validation from our utility function
  const formValid = isFormValid(selectedTab, formState);
  useEffect(() => {
    if (courtOptions.length > 0) {

      handleInputChange("selectedCourt", courtOptions[0].name || "");
    }
  })
  return (
    <div className={commonStyles.form.container}>
      <div className={commonStyles.form.grid}>
        {selectedTab === "cnr_number" && (
          <CNRNumberForm
            cnrNumber={formState.cnrNumber}
            onChange={(value) => handleInputChange("cnrNumber", value)}
          />
        )}

        {selectedTab === "advocate" && (
          <AdvocateForm
            advocateSearchMethod={formState.advocateSearchMethod}
            barCode={formState.barCode}
            selectedYear={formState.selectedYear}
            stateCode={formState.stateCode}
            advocateName={formState.advocateName}
            onMethodChange={(value) =>
              handleInputChange("advocateSearchMethod", value)
            }
            onBarCodeChange={(value) => handleInputChange("barCode", value)}
            onStateCodeChange={(value) => handleInputChange("stateCode", value)}
            onYearChange={(value) => handleInputChange("selectedYear", value)}
            onNameChange={(value) => handleInputChange("advocateName", value)}
          />
        )}

        {selectedTab === "litigant" && (
          <LitigantForm
            litigantName={formState.litigantName}
            onChange={(value) => handleInputChange("litigantName", value)}
          />
        )}

        {selectedTab === "filing_number" && (
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
            courtOptions={courtOptions}
          />
        )}

        {selectedTab === "case_number" && (
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
            courtOptions={courtOptions}
          />
        )}
      </div>

      {/* Horizontal line break */}
      <hr className="my-6 border-t border-gray-200" />

      {/* Action Buttons */}
      <div className="font-[Baskerville] font-medium flex justify-end col-span-full md:col-span-2 lg:col-span-4 gap-4">
        <button
          onClick={formState.handleClear}
          className={commonStyles.button.secondary}
        >
          {t(newCaseSearchConfig.buttons.clear)}
        </button>
        <button
          onClick={formState.handleSubmit}
          disabled={!formValid}
          className={`${commonStyles.button.primary} ${!formValid && commonStyles.button.disabled}`}
        >
          {t(newCaseSearchConfig.buttons.search)}
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
