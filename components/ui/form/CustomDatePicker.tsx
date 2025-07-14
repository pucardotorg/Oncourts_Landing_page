import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { svgIcons } from "../../../data/svgIcons";

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
  return (
    <div
      className={`${padding} relative ${borderRadius} border-[1.5px] ${borderColor}`}
    >
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat={dateFormat}
        placeholderText={placeholderText}
        className={`w-full ${height} pl-3 pr-10 py-2 font-roboto text-base ${backgroundColor} focus:outline-none focus:ring-0 ${className}`}
        readOnly={true}
        open={isOpen}
        onClickOutside={onClickOutside}
      />
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
