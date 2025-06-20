import React from 'react';
import { TextField, Dropdown } from '../../ui/form';

interface FilingNumberFormProps {
  selectedCourt: string;
  code: string;
  caseNumber: string;
  selectedYear: string;
  onCourtChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onCaseNumberChange: (value: string) => void;
  onYearChange: (value: string) => void;
}

const FilingNumberForm: React.FC<FilingNumberFormProps> = ({
  selectedCourt,
  code,
  caseNumber,
  selectedYear,
  onCourtChange,
  onCodeChange,
  onCaseNumberChange,
  onYearChange
}) => {
  const courtOptions = ["ON Court Kollam"];
  
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
        className="bg-white"
      />
      
      <TextField
        label="Code"
        value={code}
        onChange={onCodeChange}
        required
      />
      
      <TextField
        label="Filing Number"
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

export default FilingNumberForm;
