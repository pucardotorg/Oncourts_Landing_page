import React from "react";
import { TextField, Dropdown } from "../../ui/form";

interface AllFormProps {
  selectedCourt: string;
  selectedCaseType: string;
  caseNumber: string;
  selectedYear: string;
  onCourtChange: (value: string) => void;
  onCaseTypeChange: (value: string) => void;
  onCaseNumberChange: (value: string) => void;
  onYearChange: (value: string) => void;
}

const AllForm: React.FC<AllFormProps> = ({
  selectedCourt,
  selectedCaseType,
  caseNumber,
  selectedYear,
  onCourtChange,
  onCaseTypeChange,
  onCaseNumberChange,
  onYearChange,
}) => {
  const courtOptions = ["ON Court Kollam"];
  const caseTypeOptions = ["ST"];

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
        options={courtOptions}
        required
      />

      <Dropdown
        label="Case type"
        placeHolder="Select Case Type"
        value={selectedCaseType}
        onChange={onCaseTypeChange}
        options={caseTypeOptions}
        required
      />

      <TextField
        label="Case Number"
        value={caseNumber}
        onChange={onCaseNumberChange}
        placeholder="12134"
        required
      />

      <Dropdown
        label="Year"
        placeHolder="Select Year"
        value={selectedYear}
        onChange={onYearChange}
        options={yearOptions}
        required
      />
    </>
  );
};

export default AllForm;
