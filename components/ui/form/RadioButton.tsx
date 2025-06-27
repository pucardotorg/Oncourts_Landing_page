import React from "react";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioButtonProps {
  id?: string;
  name: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  required?: boolean;
  inline?: boolean;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  helperText?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  name,
  label,
  value,
  onChange,
  options,
  required = false,
  inline = true,
  className = "",
  error = false,
  disabled = false,
  helperText,
}) => {
  return (
    <div className={`font-[Roboto] mb-0 ${className}`}>
      {label && (
        <label className="block text-lg font-medium text-[#334155]">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`font-[Roboto] flex ${inline ? "space-x-6" : "flex-col space-y-2"}`}
      >
        {options.map((option, index) => (
          <label key={index} className="text-lg inline-flex items-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className={`form-radio h-4 w-4 text-teal-600 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              disabled={disabled}
            />
            <span
              className={`ml-2 text-base font-medium ${disabled ? "text-gray-500" : "text-[#334155]"}`}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>

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

export default RadioButton;
