import React from "react";

interface FullscreenButtonProps {
  url: string;
  iconColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  size?: number;
  className?: string;
}

const FullscreenButton: React.FC<FullscreenButtonProps> = ({
  url,
  iconColor = "#ffffff",
  borderColor = "transparent",
  backgroundColor = "rgba(0, 0, 0, 0.4)",
  size = 80,
  className = "",
}) => {
  return (
    <button
      className={`flex items-center justify-center rounded-full hover:opacity-90 transition-opacity ${className}`}
      aria-label="View fullscreen"
      onClick={() => window.open(url, "_blank")}
      style={{
        width: size,
        height: size,
        backgroundColor,
        border: `2px solid ${borderColor}`,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size * 0.5}
        height={size * 0.5}
        fill="none"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 3H5a2 2 0 0 0-2 2v4" />
        <path d="M15 3h4a2 2 0 0 1 2 2v4" />
        <path d="M9 21H5a2 2 0 0 1-2-2v-4" />
        <path d="M15 21h4a2 2 0 0 0 2-2v-4" />
      </svg>
    </button>
  );
};

export default FullscreenButton;
