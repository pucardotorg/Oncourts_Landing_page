import React, { useCallback, useEffect, useState } from "react";
import { svgIcons } from "../data/svgIcons";
import { useMediaQuery } from "@mui/material";

const InfoBanner: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const tenantId = localStorage.getItem("tenant-id") || "kl";
  const [messages, setMessages] = useState<string[]>([]);

  const getInfoMessage = useCallback(async () => {
    try {
      const response = await fetch(
        `/egov-mdms-service/v1/_search?tenantId=${tenantId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            MdmsCriteria: {
              tenantId: tenantId,
              moduleDetails: [
                {
                  moduleName: "LandingPage",
                  masterDetails: [{ name: "NotificationMessage" }],
                },
              ],
            },
            RequestInfo: {
              apiId: "Rainmaker",
              msgId: `${Date.now()}|en_IN`,
            },
          }),
        }
      );
      const data = await response.json();
      const message =
        data?.MdmsRes?.["LandingPage"]?.NotificationMessage?.[0]?.message;
      if (Boolean(message)) {
        setMessages([message]);
      }
    } catch (error) {
      console.error("Error fetching court options:", error);
      setMessages([]);
    }
  }, [tenantId]);

  useEffect(() => {
    getInfoMessage();
  }, []);

  const message = messages?.[0];
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

  if (!Boolean(messages?.[0])) {
    return null;
  }

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
