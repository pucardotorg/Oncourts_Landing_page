import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { svgIcons } from "../../../data/svgIcons";

// Helper function to format date according to the specified format
const formatDate = (date: Date | null, format: string): string => {
  if (!date) return "";

  // Simple implementation for dd-MM-yyyy format
  if (format === "dd-MM-yyyy") {
    // Get day, month, and year components directly to avoid timezone issues
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Default format
  return date.toLocaleDateString();
};

// Helper function to create a date at noon to avoid timezone issues
const createDateAtNoon = (year: number, month: number, day: number): Date => {
  return new Date(year, month, day, 12, 0, 0);
};

interface CustomDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  isOpen: boolean;
  onIconClick: () => void;
  onClickOutside: () => void;
  placeholderText?: string;
  dateFormat?: string;
  className?: string;
  borderColor?: string;
  borderRadius?: string;
  padding?: string;
  iconColor?: string;
  backgroundColor?: string;
  height?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selected,
  onChange,
  isOpen,
  onIconClick,
  onClickOutside,
  placeholderText = "DD-MM-YYYY",
  dateFormat = "dd-MM-yyyy",
  className = "",
  borderColor = "border-[#3D3C3C]",
  borderRadius = "rounded-md",
  padding = "",
  backgroundColor = "bg-white",
  height = "h-10",
}) => {
  // Initialize with a normalized date (noon time) if selected is provided
  const initialDate = selected
    ? createDateAtNoon(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate()
      )
    : null;

  // Internal state for the selected date
  const [internalDate, setInternalDate] = useState<Date | null>(initialDate);

  // Sync with parent component when selected prop changes
  useEffect(() => {
    if (selected) {
      const normalizedDate = createDateAtNoon(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate()
      );
      setInternalDate(normalizedDate);
    } else {
      setInternalDate(null);
    }
  }, [selected]);
  return (
    <div
      className={`${padding} relative ${borderRadius} border-[1.5px] ${borderColor}`}
    >
      <div className="custom-date-picker-wrapper">
        {/* Input field that displays the selected date */}
        <input
          type="text"
          readOnly
          className={`w-full ${height} pl-3 pr-10 py-2 font-roboto text-base ${backgroundColor} focus:outline-none focus:ring-0 ${className}`}
          placeholder={placeholderText}
          value={formatDate(internalDate, dateFormat)}
          onClick={onIconClick}
        />

        {/* Actual DatePicker component */}
        {isOpen && (
          <div className="absolute top-full left-0 z-50 bg-white shadow-lg border border-gray-200 rounded-md">
            <DatePicker
              selected={internalDate}
              onChange={(date) => {
                if (date) {
                  // Extract date components and create a new date at noon
                  const year = date.getFullYear();
                  const month = date.getMonth();
                  const day = date.getDate();

                  // Create a normalized date at noon to avoid timezone issues
                  const normalizedDate = createDateAtNoon(year, month, day);

                  // Update both internal state and parent component
                  setInternalDate(normalizedDate);
                  onChange(normalizedDate);
                } else {
                  setInternalDate(null);
                  onChange(null);
                }

                // Close the calendar
                onClickOutside();
              }}
              inline
              showPopperArrow={false}
              fixedHeight
              // Use a custom day class name to ensure proper styling
              dayClassName={() => "react-datepicker__day"}
            />
          </div>
        )}
      </div>
      <div
        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer z-10"
        onClick={onIconClick}
      >
        <svgIcons.CalendarIcon />
      </div>
    </div>
  );
};

export default CustomDatePicker;
