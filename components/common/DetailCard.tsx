import React, { ReactNode } from "react";

interface DetailCardProps {
  t: (key: string) => string;
  icon: ReactNode;
  heading: string;
  points: string[];
  className?: string;
}

const DetailCard: React.FC<DetailCardProps> = ({
  t,
  icon,
  heading,
  points,
  className = "",
}) => {
  return (
    <div
      className={`font-roboto border border-[#CBD5E1] p-8 rounded-lg shadow-sm ${className}`}
    >
      <div className="flex items-center mb-6">
        <div className="text-teal-600 mr-4">{icon}</div>
        <h3 className="text-[28px] text-[#0F766E] font-semibold">
          {t(heading)}
        </h3>
      </div>
      <ul className="font-normal text-[20px] space-y-3">
        {points.map((point, index) => (
          <li key={index} className="flex flex-col items-start">
            <span className="text-[#334155]">{t(point)}</span>
            {index !== points.length - 1 && (
              <span className="border-b border-[#CBD5E1] w-[40%] mt-1"></span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DetailCard;
