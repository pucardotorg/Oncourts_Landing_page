import React from "react";
import { TextField } from "../../ui/form";
import { CourtRoom } from "../../../types";
import CustomDropdown from "../../ui/form/CustomDropdown";

interface FilingNumberFormProps {
  selectedCourt: string;
  code: string;
  caseNumber: string;
  selectedYear: string;
  onCourtChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onCaseNumberChange: (value: string) => void;
  onYearChange: (value: string) => void;
  courtOptions: CourtRoom[];
}

const FilingNumberForm: React.FC<FilingNumberFormProps> = ({
  selectedCourt,
  code,
  caseNumber,
  selectedYear,
  onCourtChange,
  onCodeChange,
  onCaseNumberChange,
  onYearChange,
  courtOptions,
}) => {
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
      <CustomDropdown
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

      <TextField label="Code" value={code} onChange={onCodeChange} required />

      <TextField
        label="Filing Number"
        value={caseNumber}
        onChange={onCaseNumberChange}
        required
      />

      <CustomDropdown
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

export default FilingNumberForm;
