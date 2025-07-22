import React from "react";

interface SectionHeadingProps {
  title: string;
  fontSize?: string;
  showBorder?: boolean;
  className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  fontSize = "text-5xl",
  showBorder = true,
  className = "",
}) => {
  return (
    <div
      className={`${fontSize} font-medium text-center mb-8 font-libre text-[#3A3A3A] ${className}`}
      style={{
        WebkitTextStrokeWidth: "0.5px",
      }}
    >
      <span className="inline-block pb-3">{title}</span>
      {showBorder && (
        <div className="border-b border-[#CBD5E1] w-full md:w-[40%] mx-auto mt-1"></div>
      )}
    </div>
  );
};

export default SectionHeading;
