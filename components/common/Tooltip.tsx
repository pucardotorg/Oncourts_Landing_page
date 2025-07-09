import React from "react";

interface TooltipProps {
  text: string;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text, className = "" }) => {
  return (
    <div
      className={`absolute left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-[#1E1E1E] text-white text-sm rounded-md whitespace-nowrap z-50 ${className}`}
    >
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 border-8 border-transparent border-b-[#1E1E1E]" />
      {text}
    </div>
  );
};

export default Tooltip;
