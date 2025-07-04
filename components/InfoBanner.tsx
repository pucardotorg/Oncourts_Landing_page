import React from "react";
import { svgIcons } from "../data/svgIcons";

interface InfoBannerProps {
  messages: string[];
}

const InfoBanner: React.FC<InfoBannerProps> = ({ messages = [] }) => {
  const message =
    messages[0] ||
    "The ON Courts platform will be unavailable from 5 PM to 9 PM on 16/5/25 due to scheduled maintenance.";
  const MessageContent = () => (
    <div className="flex items-center space-x-2 px-4">
      <svgIcons.clockIcon />
      <h4 className="text-[ #3A3A3A] font-sans font-medium text-[20px] leading-[28px] tracking-[0.01em] text-center">
        {message}
      </h4>
    </div>
  );

  return (
    <div className="flex items-center h-[68px] bg-[#F0FDFA] border-b border-[#E5E7EB] py-2 overflow-hidden">
      <div className="relative flex whitespace-nowrap animate-marquee">
        <MessageContent />
        <MessageContent />
        <MessageContent />
        <MessageContent />
      </div>
    </div>
  );
};

export default InfoBanner;
