import React from "react";
import Link from "next/link";
import { svgIcons } from "../data/svgIcons";

interface DropdownItem {
  label: string;
  href?: string;
  target?: string;
  subItems?: DropdownItem[];
  isLast?: boolean;
}

interface DropdownMenuProps {
  items: DropdownItem[];
  isOpen: boolean;
  t: (key: string) => string;
  isLast?: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  isOpen,
  t,
  isLast,
}) => {
  if (!isOpen) return null;

  const renderDropdownItem = (item: DropdownItem) => {
    if (item.subItems) {
      return (
        <div className="group relative" key={item.label}>
          <div className="flex items-center justify-between mx-[15px] py-2 hover:text-[#007E7E] group cursor-pointer border-b border-[#CBD5E1]">
            <span className="font-sans font-medium text-[20px] leading-[28px] tracking-[0.01em]">
              {t(item.label)}
            </span>
            <span className="text-[#3A3A3A] group-hover:text-[#007E7E]">
              <svgIcons.RightArrowIcon className="w-5 h-5" />
            </span>
          </div>

          <div className="absolute left-full top-[8px] min-w-[200px] bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 -mt-2 border-l border-[#E2E8F0]">
            {item.subItems.map((subItem) => (
              <Link
                key={subItem.label}
                href={subItem.href || "#"}
                target={subItem.target}
                className="block mx-[15px] py-2 text-sm text-gray-700  hover:text-[#007E7E] border-b border-[#CBD5E1] last:border-b-0"
              >
                <div className="flex items-center center ">
                  <span className="text-[#3A3A3A] font-sans font-medium text-[20px] leading-[28px] tracking-[0.01em] hover:bg-gray-50 hover:text-[#007E7E]">
                    {t(subItem.label)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href || "#"}
        className="block py-2 mx-[15px] text-sm text-gray-700 hover:text-[#007E7E] border-b border-[#E5E5E5] last:border-b-0"
      >
        <span className="text-[#3A3A3A] font-sans font-medium text-[20px] leading-[28px] tracking-[0.01em] hover:bg-gray-50 hover:text-[#007E7E]">
          {t(item.label)}
        </span>
      </Link>
    );
  };

  return (
    <div
      className={`absolute z-50 top-[59px] min-w-[200px] bg-white shadow-lg ${isLast ? "right-0" : "left-0"}`}
    >
      <span className="text-[#3A3A3A] font-sans font-medium text-[20px] leading-[28px] tracking-[0.01em]">
        {items.map(renderDropdownItem)}
      </span>
    </div>
  );
};

export default DropdownMenu;
