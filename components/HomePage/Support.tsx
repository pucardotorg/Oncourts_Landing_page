import React, { useState } from "react";
import Link from "next/link";
import { svgIcons } from "../../data/svgIcons";
import { SupportData } from "../../data/SupportData";

const Support: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="p-8 px-6 md:px-16 py-12 min-h-[500px]" id="resources">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-teal">
          {SupportData?.header}
        </h2>
        <p className="text-darkGrey text-lg md:text-xl lg:text-2xl xl:text-[22px] leading-[130%] tracking-[0%] text-center font-raleway font-normal mt-6 mx-auto max-w-[55%] sm:max-w-[65%] md:max-w-[50%] lg:max-w-[50%] xl:max-w-[50%]">
          {SupportData?.SubHeader}
        </p>
      </div>

      <div className="flex gap-8 md:gap-4 sm:gap-2 w-full">
        <div className="max-w-lg w-full mx-auto bg-white rounded-xl border border-gray-300 shadow-md p-8">
          <h3 className="font-bold text-black mb-6 text-xl">
            {SupportData?.Resources?.header}
          </h3>
          <div className="space-y-4"></div>
          {SupportData?.Resources?.data?.map((data, index) => (
            <div key={index} className="mb-4">
              <Link href={data?.link} className="block mb-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onMouseEnter={() => setHoveredItem(data?.section)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                      <svgIcons.GuideIcon
                        isHovered={hoveredItem === data?.section}
                      />
                    </div>
                    <span className="text-gray-700 hover:text-teal hover:font-semibold hover:underline font-raleway font-normal">
                      {data?.text}
                    </span>
                  </div>
                  <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                    <svgIcons.ArrowIcon
                      isHovered={hoveredItem === data?.section}
                    />
                  </div>
                </div>
              </Link>
              {index !== SupportData?.Resources?.data?.length - 1 && (
                <hr className="my-2" />
              )}
            </div>
          ))}
        </div>

        <div className="max-w-lg w-full mx-auto bg-white rounded-xl border border-gray-300 shadow-md p-8">
          <h3 className="font-bold text-black mb-6 text-xl">
            {SupportData?.QuickLinks?.header}
          </h3>
          <div className="space-y-4"></div>
          {SupportData?.QuickLinks?.data?.map((data, index) => (
            <div key={index} className="mb-4">
              <Link href={data?.link} className="block mb-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onMouseEnter={() => setHoveredItem(data?.section)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                      <svgIcons.GuideIcon
                        isHovered={hoveredItem === data?.section}
                      />
                    </div>
                    <span className="text-gray-700 hover:text-teal hover:font-semibold hover:underline font-raleway font-normal">
                      {data?.text}
                    </span>
                  </div>
                  <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                    <svgIcons.ArrowIcon
                      isHovered={hoveredItem === data?.section}
                    />
                  </div>
                </div>
              </Link>
              {index !== SupportData?.Resources?.data?.length - 1 && (
                <hr className="my-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-3xl font-semibold text-black mb-6">
          {SupportData?.HelpDesk?.header}
        </h3>
        <div className="relative max-w-3xl mx-auto pt-4">
          <div className="absolute left-1/2 top-0 bottom-0 w-[0.5px] bg-teal"></div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-2">
            {SupportData?.HelpDesk?.data?.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 pb-4 ${
                  index < SupportData?.HelpDesk?.data?.length - 2
                    ? "border-b border-teal"
                    : ""
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  {svgIcons[item?.icon] &&
                    React.createElement(svgIcons[item.icon])}
                </div>
                <div>
                  <p className="text-teal font-medium">
                    {item?.href ? (
                      <a href={item?.href}>
                        {item?.label}
                        {item?.data ? `: ${item?.data}` : ""}
                      </a>
                    ) : (
                      <>
                        {item?.label}
                        {item?.data ? `: ${item?.data}` : ""}
                      </>
                    )}
                  </p>
                  {item?.subData && (
                    <p className="text-xs text-teal">{item?.subData}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
