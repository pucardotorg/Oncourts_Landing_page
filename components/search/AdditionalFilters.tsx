import React from "react";
import { Dropdown, DatePickerComponent } from "../ui/form";

interface AdditionalFiltersProps {
  selectedTab: string;
  filterState: {
    courtName: string;
    caseType: string;
    hearingDateFrom: string;
    hearingDateTo: string;
    filingYear: string;
    caseStage: string;
    caseStatus: string;
  };
  onFilterChange: (field: string, value: string) => void;
  onResetFilters: () => void;
}

const AdditionalFilters: React.FC<AdditionalFiltersProps> = ({
  selectedTab,
  filterState,
  onFilterChange,
  onResetFilters,
}) => {
  // Define options for dropdowns
  const courtOptions = ["ON Court Kollam", "ON Court Kochi"];
  const caseTypeOptions = ["CMP", "ST"];
  const caseStageOptions = ["Cognizance", "Hearing", "Arguments"];
  const caseStatusOptions = ["Pending", "Disposed"];

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
    <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden border border-[#E2E8F0]">
      <div className="p-4 bg-[#F8FAFC]">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-[Roboto] font-semibold text-[#0F172A]">Filter</h2>
          <button
            onClick={onResetFilters}
            className="text-xl font-[Roboto] font-medium text-[#2563EB] hover:text-blue-800"
          >
            Reset all
          </button>
        </div>

        <hr className="my-2 border-t border-[#CBD5E1]" />

        {(selectedTab === "Advocate" ||
          selectedTab === "Litigant" ||
          selectedTab === "All") && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <Dropdown
              label="Court Name"
              placeHolder="Select Court"
              value={filterState.courtName}
              onChange={(value) => onFilterChange("courtName", value)}
              options={courtOptions}
              className="bg-[#F8FAFC] border-[#94A3B8]"
            />

            <Dropdown
              label="Case type"
              placeHolder="Select Case Type"
              value={filterState.caseType}
              onChange={(value) => onFilterChange("caseType", value)}
              options={caseTypeOptions}
              className="bg-[#F8FAFC] border-[#94A3B8]"
            />

            <DatePickerComponent
              label="Next Hearing Date"
              value={filterState.hearingDateFrom}
              onChange={(value) => onFilterChange("hearingDateFrom", value)}
            />

            <DatePickerComponent
              label="To"
              value={filterState.hearingDateTo}
              onChange={(value) => onFilterChange("hearingDateTo", value)}
            />

            <Dropdown
              label="Year of Filing"
              placeHolder="Select Year"
              value={filterState.filingYear}
              onChange={(value) => onFilterChange("filingYear", value)}
              options={yearOptions}
              className="bg-[#F8FAFC] border-[#94A3B8]"
            />

            <Dropdown
              label="Case Stage"
              placeHolder="Select Case Stage"
              value={filterState.caseStage}
              onChange={(value) => onFilterChange("caseStage", value)}
              options={caseStageOptions}
              className="bg-[#F8FAFC] border-[#94A3B8]"
            />

            <Dropdown
              label="Case Status"
              placeHolder="Select Case Status"
              value={filterState.caseStatus}
              onChange={(value) => onFilterChange("caseStatus", value)}
              options={caseStatusOptions}
              className="bg-[#F8FAFC] border-[#94A3B8]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalFilters;
