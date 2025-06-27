import React, { useState, useEffect } from "react";
import { DatePickerComponent } from "../ui/form";
import {
  CaseStage,
  CaseStatus,
  CaseType,
  CourtRoom,
  FilterState,
} from "../../types";
import CustomDropdown from "../ui/form/CustomDropdown";

interface AdditionalFiltersProps {
  selectedTab: string;
  filterState: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
  courtOptions: CourtRoom[];
  caseStageOptions: CaseStage[];
  caseTypeOptions: CaseType[];
  caseStatusOptions: CaseStatus[];
}

const AdditionalFilters: React.FC<AdditionalFiltersProps> = ({
  selectedTab,
  filterState,
  onApplyFilters,
  onResetFilters,
  courtOptions,
  caseStageOptions,
  caseTypeOptions,
  caseStatusOptions,
}) => {
  // Local state to track filter changes before applying them
  const [localFilters, setLocalFilters] = useState<FilterState>(filterState);

  // Update local filters when parent filterState changes
  useEffect(() => {
    setLocalFilters(filterState);
  }, [filterState]);

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

  // Handle local filter changes
  const handleLocalFilterChange = (field: string, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Apply all filters at once when search button is clicked
  const applyFilters = () => {
    onApplyFilters(localFilters);
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm overflow-visible border border-[#E2E8F0]">
      <div className="p-4 bg-[#F8FAFC]">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-[Baskerville] font-semibold text-[#0F172A]">
            Filter
          </h2>

          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              className="px-2 text-lg font-[Inter] font-medium text-[#2563EB] hover:text-blue-800 bg-white rounded-lg border border-[#E2E8F0]"
            >
              Apply Filter
            </button>
            <button
              onClick={onResetFilters}
              className="text-lg font-[Inter] font-medium text-[#64748B] hover:text-gray-800"
            >
              Reset all
            </button>
          </div>
        </div>

        <hr className="my-2 border-t border-[#CBD5E1]" />

        {(selectedTab === "Advocate" ||
          selectedTab === "Litigant" ||
          selectedTab === "All") && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <CustomDropdown
              label="Court Name"
              placeHolder="Select Court"
              value={localFilters.courtName}
              onChange={(value) => handleLocalFilterChange("courtName", value)}
              options={
                courtOptions?.map((court: CourtRoom) => ({
                  label: court?.name || "",
                  value: court?.code || "",
                })) || []
              }
              className="bg-[#F8FAFC] border-[#94A3B8]"
            />

            <CustomDropdown
              label="Case type"
              placeHolder="Select Case Type"
              value={localFilters.caseType}
              onChange={(value) => handleLocalFilterChange("caseType", value)}
              options={
                caseTypeOptions?.map((type: CaseType) => ({
                  label: type?.name || "",
                  value: type?.code || "",
                })) || []
              }
              className="bg-[#F8FAFC] border-[#94A3B8]"
            />

            <DatePickerComponent
              label="Next Hearing Date"
              value={localFilters.hearingDateFrom}
              onChange={(value) =>
                handleLocalFilterChange("hearingDateFrom", value)
              }
            />

            <DatePickerComponent
              label="To"
              value={localFilters.hearingDateTo}
              onChange={(value) =>
                handleLocalFilterChange("hearingDateTo", value)
              }
            />

            <CustomDropdown
              label="Year of Filing"
              placeHolder="Select Year"
              value={localFilters.yearOfFiling}
              onChange={(value) =>
                handleLocalFilterChange("yearOfFiling", value)
              }
              options={yearOptions}
              className="bg-[#F8FAFC] border-[#94A3B8]"
            />
            <CustomDropdown
              label="Case Stage"
              placeHolder="Select Case Stage"
              value={localFilters.caseStage}
              onChange={(value) => handleLocalFilterChange("caseStage", value)}
              options={
                caseStageOptions?.map((stage: CaseStage) => ({
                  label: stage?.subStage || "",
                  value: stage?.code || "",
                })) || []
              }
              className="bg-[#F8FAFC] border-[#94A3B8]"
            />

            <CustomDropdown
              label="Case Status"
              placeHolder="Select Case Status"
              value={localFilters.caseStatus}
              onChange={(value) => handleLocalFilterChange("caseStatus", value)}
              options={
                caseStatusOptions?.map((status: CaseStatus) => ({
                  label: status?.name || "",
                  value: status?.code || "",
                })) || []
              }
              className="bg-[#F8FAFC] border-[#94A3B8]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalFilters;
