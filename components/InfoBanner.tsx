import React from "react";
import { svgIcons } from "../data/svgIcons";
import { useMediaQuery } from "@mui/material";

interface InfoBannerProps {
  messages: string[];
}

const InfoBanner: React.FC<InfoBannerProps> = ({ messages = [] }) => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  const message =
    messages[0] ||
    "The ON Courts platform will be unavailable from 5 PM to 9 PM on 16/5/25 due to scheduled maintenance.";
  const MessageContent = () => (
    <div className="flex items-center space-x-2 px-4">
      <svgIcons.ClockIcon2 width={isMobile ? "22" : "32"} />
      <h4
        className={`text-[ #3A3A3A] font-sans font-medium  tracking-[0.01em] text-center ${isMobile ? "text-[15px] leading-[18px]" : "text-[20px] leading-[28px]"}`}
      >
        {message}
      </h4>
    </div>
  );

  return (
    <div
      className={`flex items-center  bg-[#F0FDFA] border-b border-[#E5E7EB] py-2 overflow-hidden ${isMobile ? "h-[43px]" : "h-[68px]"}`}
    >
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
