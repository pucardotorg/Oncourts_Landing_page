import React from "react";
import Link from "next/link";

interface DropdownItem {
  label: string;
  href?: string;
  subItems?: DropdownItem[];
}

interface DropdownMenuProps {
  items: DropdownItem[];
  isOpen: boolean;
  t: (key: string) => string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, isOpen, t }) => {
  if (!isOpen) return null;

  const renderDropdownItem = (item: DropdownItem) => {
    if (item.subItems) {
      return (
        <div className="group relative" key={item.label}>
          <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer">
            <span className="text-sm text-gray-700">{t(item.label)}</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2"
            >
              <path
                d="M4.5 9L7.5 6L4.5 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="absolute left-full top-0 min-w-[200px] bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 -mt-2">
            {item.subItems.map((subItem) => (
              <Link
                key={subItem.label}
                href={subItem.href || "#"}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#007E7E]"
              >
                {t(subItem.label)}
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
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#007E7E]"
      >
        {t(item.label)}
      </Link>
    );
  };

  return (
    <div className="absolute z-50 top-full left-0 min-w-[200px] bg-white shadow-lg rounded-md py-1 mt-1 whitespace-nowrap">
      {items.map(renderDropdownItem)}
    </div>
  );
};

export default DropdownMenu;
