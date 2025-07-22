import React from "react";

interface CustomCardProps {
  title: string;
  description: string;
}

const CustomCard: React.FC<CustomCardProps> = ({ title, description }) => {
  return (
    <div className="font-roboto bg-white p-8 rounded-lg shadow-md flex flex-col">
      <span className="text-[32px] font-medium font-roboto text-[#3A3A3A]">
        {title}
      </span>
      <div className="border-b border-[#CBD5E1] my-2 w-[80%]"></div>
      <p className="text-[20px] font-normal text-[#334155]">{description}</p>
    </div>
  );
};

export default CustomCard;
