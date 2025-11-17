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
      className={`${fontSize} font-medium text-center mb-8 md:mb-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)] md:text-[clamp(25.79px,calc(25.79px+((40-25.79)*((100vw-1200px)/662))),40px)] md:leading-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)] font-libre text-[#3A3A3A] ${className}`}
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
