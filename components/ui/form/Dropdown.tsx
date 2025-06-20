import React from "react";

interface DropdownOption {
  value: string;
  label?: string;
}

interface DropdownProps {
  id?: string;
  name?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[] | string[];
  required?: boolean;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  helperText?: string;
  placeHolder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  required = false,
  className = "",
  error = false,
  disabled = false,
  helperText,
  placeHolder,
}) => {
  // Common class for all form select elements for consistent styling
  const baseSelectClass =
    "block w-full px-3 py-2 h-10 text-base border-[1.5px] border-[#3D3C3C] rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500";
  const errorClass = error
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "";
  const disabledClass = disabled ? "bg-gray-100 cursor-not-allowed" : "";

  const selectClass = `${baseSelectClass} ${errorClass} ${disabledClass} ${className}`;

  // Check if options are provided as simple strings or objects with value/label
  const isStringOptions = options.length > 0 && typeof options[0] === "string";

  return (
    <div className="mb-0">
      {label && (
        <label
          htmlFor={id || name}
          className="block text-lg font-medium text-[#0A0A0A] mb-1"
        >
          {label}
          {required && (
            <span className="text-red-500 text-2xl leading-none self-start">
              *
            </span>
          )}
        </label>
      )}

      <select
        id={id || name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
        disabled={disabled}
      >
        {placeHolder && (
          <option value="" disabled hidden>
            {placeHolder}
          </option>
        )}
        {isStringOptions
          ? (options as string[]).map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))
          : (options as DropdownOption[]).map((option, index) => (
              <option key={index} value={option.value}>
                {option.label || option.value}
              </option>
            ))}
      </select>

      {helperText && (
        <p
          className={`text-xs mt-1 ${error ? "text-red-500" : "text-gray-500"}`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Dropdown;
