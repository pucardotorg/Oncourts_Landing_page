import React from "react";
import Link from "next/link";

export interface NavItemProps {
  href: string;
  label: string;
  isActive?: boolean;
  hasDropdown?: boolean;
  onClick?: () => void;
  t: (key: string) => string;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  label,
  isActive = false,
  hasDropdown = false,
  onClick,
  t,
}) => {
  if (hasDropdown) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onClick?.();
        }}
        className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors
          ${isActive ? "text-[#007E7E]" : "text-[#3A3A3A] hover:text-[#007E7E]"}`}
      >
        {t(label)}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform ${isActive ? "rotate-180" : ""}`}
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors
        ${isActive ? "text-[#007E7E]" : "text-[#3A3A3A] hover:text-[#007E7E]"}`}
    >
      {t(label)}
    </Link>
  );
};

export default NavItem;
