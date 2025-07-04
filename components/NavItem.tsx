import React from "react";
import Link from "next/link";
import { svgIcons } from "../data/svgIcons";

export interface NavItemProps {
  href: string;
  label: string;
  isActive?: boolean;
  hasDropdown?: boolean;
  onClick?: () => void;
  t: (key: string) => string;
  isDropdownOpen?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  label,
  isActive = false,
  hasDropdown = false,
  onClick,
  t,
  isDropdownOpen = false,
}) => {
  if (hasDropdown) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onClick?.();
        }}
        className={`text-[20px] leading-[28px] tracking-[0.01em] flex items-center gap-1 px-4 py-2 font-medium font-sans`}
      >
        <span
          className={
            isActive ? "text-[#0F766E]" : "text-[#3A3A3A] hover:text-[#0F766E]"
          }
        >
          {t(label)}
        </span>
        <span>
          {isDropdownOpen ? (
            <svgIcons.upArrowIcon fill="#0F766E" />
          ) : (
            <svgIcons.downArrowIcon />
          )}
        </span>
      </button>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-[20px] leading-[28px] tracking-[0.01em] flex items-center gap-1 px-4 py-2 font-medium font-sans
        ${isActive ? "text-[#0F766E]" : "text-[#3A3A3A] hover:text-[#0F766E]"}`}
    >
      {t(label)}
    </Link>
  );
};

export default NavItem;
