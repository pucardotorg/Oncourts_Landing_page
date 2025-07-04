import React from "react";

interface SectionHeadingProps {
  title: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ title }) => {
  return (
    <div className="text-5xl font-medium text-center mb-8 font-[Baskerville] text-[#3A3A3A]">
      <span className="inline-block pb-3">{title}</span>
      <div className="border-b border-[#CBD5E1] w-full md:w-[40%] mx-auto mt-1"></div>
    </div>
  );
};

export default SectionHeading;
