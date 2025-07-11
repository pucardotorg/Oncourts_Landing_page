import React, { useState } from "react";
import Link from "next/link";
import { svgIcons } from "../../data/svgIcons";

interface ResourceItemProps {
  t: (key: string) => string;
  heading: string;
  items: {
    icon: string;
    text: string;
    link: string;
    section: string;
    newTab: boolean;
  }[];
}

const ResourceItem: React.FC<ResourceItemProps> = ({ t, heading, items }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#CBD5E1] h-full">
      <h2 className="text-2xl font-semibold mb-4 text-[#3A3A3A]">
        {t(heading)}
      </h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <Link
              target={item.newTab ? "_blank" : "_self"}
              rel={item.newTab ? "noopener noreferrer" : undefined}
              href={item?.link}
              className="block mb-4"
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onMouseEnter={() => setHoveredItem(item?.section)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="font-[Roboto] font-medium text-[#334155] text-lg md:text-xl flex items-center space-x-4">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <svgIcons.GuideIcon
                      color="#0F766E"
                      hoverColor="#0F766E"
                      isHovered={hoveredItem === item?.section}
                    />
                  </div>
                  <span className="hover:text-[#0F766E] hover:font-semibold hover:underline">
                    {t(item?.text)}
                  </span>
                </div>
                <div className="w-5 h-5 ml-2 flex-shrink-0 flex items-center justify-center">
                  <svgIcons.ArrowIcon
                    color="#0F766E"
                    hoverColor="#0F766E"
                    isHovered={hoveredItem === item?.section}
                  />
                </div>
              </div>
            </Link>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ResourceItem;
