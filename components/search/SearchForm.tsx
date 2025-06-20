import React from "react";
import CNRNumberForm from "./forms/CNRNumberForm";
import CaseNumberForm from "./forms/CaseNumberForm";
import AdvocateForm from "./forms/AdvocateForm";
import LitigantForm from "./forms/LitigantForm";
import FilingNumberForm from "./forms/FilingNumberForm";
import AllForm from "./forms/AllForm";
import { newCaseSearchConfig } from "../../data/newCaseSearchConfig";
import { commonStyles } from "../../styles/commonStyles";
import { isFormValid } from "../../utils/searchUtils";

import { FormState } from "../../types/search";

interface FormStateWithHandlers extends FormState {
  handleClear: () => void;
  handleSubmit: () => void;
}

interface SearchFormProps {
  selectedTab: string;
  formState: FormStateWithHandlers;
  handleInputChange: (field: string, value: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  selectedTab,
  formState,
  handleInputChange,
}) => {
  // Get form validation from our utility function
  const formValid = isFormValid(selectedTab, formState);
  return (
    <div className={commonStyles.form.container}>
      <div className={commonStyles.form.grid}>
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
          className={commonStyles.button.secondary}
        >
          {newCaseSearchConfig.buttons.clear}
        </button>
        <button
          onClick={formState.handleSubmit}
          disabled={!formValid}
          className={`${commonStyles.button.primary} ${!formValid && commonStyles.button.disabled}`}
        >
          {newCaseSearchConfig.buttons.search}
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
