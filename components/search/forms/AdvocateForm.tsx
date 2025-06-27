import React from "react";
import { TextField, RadioButton } from "../../ui/form";
import CustomDropdown from "../../ui/form/CustomDropdown";

interface AdvocateFormProps {
  advocateSearchMethod: string;
  barCode: string;
  stateCode: string;
  selectedYear: string;
  advocateName: string;
  onMethodChange: (value: string) => void;
  onBarCodeChange: (value: string) => void;
  onStateCodeChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onNameChange: (value: string) => void;
}

const AdvocateForm: React.FC<AdvocateFormProps> = ({
  advocateSearchMethod,
  barCode,
  stateCode,
  selectedYear,
  advocateName,
  onMethodChange,
  onBarCodeChange,
  onStateCodeChange,
  onYearChange,
  onNameChange,
}) => {
  const radioOptions = [
    { value: "Bar Code", label: "Bar Code" },
    { value: "Advocate Name", label: "Advocate Name" },
  ];

  // Removed dropdown options for state code and barcode - using TextField instead

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
    <div className="col-span-4">
      <RadioButton
        name="advocateSearchMethod"
        label="Select Method :"
        value={advocateSearchMethod}
        onChange={onMethodChange}
        options={radioOptions}
        className="flex items-center gap-4"
        inline={true}
      />

      {advocateSearchMethod === "Bar Code" ? (
        <div className="grid grid-cols-3 gap-4 mt-4">
          <TextField
            label="State Code"
            value={stateCode}
            onChange={onStateCodeChange}
            required
          />
          <TextField
            label="Barcode"
            value={barCode}
            onChange={onBarCodeChange}
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
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="col-span-1">
            <TextField
              label="Name"
              value={advocateName}
              onChange={onNameChange}
              required
              helperText="Minimum 3 characters needed"
              error={advocateName.length > 0 && advocateName.length < 3}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvocateForm;
