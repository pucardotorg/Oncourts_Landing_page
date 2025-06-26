import React from "react";
import { TextField, Dropdown } from "../../ui/form";
import { CourtRoom } from "../../../types";

interface CaseNumberFormProps {
  selectedCourt: string;
  selectedCaseType: string;
  caseNumber: string;
  selectedYear: string;
  onCourtChange: (value: string) => void;
  onCaseTypeChange: (value: string) => void;
  onCaseNumberChange: (value: string) => void;
  onYearChange: (value: string) => void;
  courtOptions: CourtRoom[];
}

const CaseNumberForm: React.FC<CaseNumberFormProps> = ({
  selectedCourt,
  selectedCaseType,
  caseNumber,
  selectedYear,
  onCourtChange,
  onCaseTypeChange,
  onCaseNumberChange,
  onYearChange,
  courtOptions,
}) => {
  const caseTypeOptions = ["ST", "CMP"];

  // Generate years from 2024 to current year
  const generateYearOptions = (): string[] => {
    const startYear = 2024;
    const currentYear = new Date().getFullYear();
    const years: string[] = [];

    for (let year = startYear; year <= currentYear; year++) {
      years.push(year.toString());
    }

    return years;
  };

  const yearOptions = generateYearOptions();

  return (
    <>
      <Dropdown
        label="Court"
        placeHolder="Select Court"
        value={selectedCourt}
        onChange={onCourtChange}
        options={
          courtOptions?.map((court: CourtRoom) => ({
            label: court?.name || "",
            value: court?.code || "",
          })) || []
        }
        required
        className="bg-white"
      />

      <Dropdown
        label="Case type"
        placeHolder="Select Case Type"
        value={selectedCaseType}
        onChange={onCaseTypeChange}
        options={caseTypeOptions}
        required
        className="bg-white"
      />

      <TextField
        label="Case Number"
        value={caseNumber}
        onChange={onCaseNumberChange}
        required
      />

      <Dropdown
        label="Year"
        placeHolder="Select Year"
        value={selectedYear}
        onChange={onYearChange}
        options={yearOptions}
        required
        className="bg-white"
      />
    </>
  );
};

export default CaseNumberForm;
