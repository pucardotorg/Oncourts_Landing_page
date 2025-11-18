import React from "react";

interface SectionHeadingProps {
  title: string;
  fontSize?: string;
  showBorder?: boolean;
  className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  fontSize = "text-5xl",
  showBorder = true,
  className = "",
}) => {
  // Map Tailwind font size tokens to pixel values (Tailwind default scale)
  const fontPxMap: Record<string, number> = {
    "text-6xl": 60,
    "text-5xl": 48,
    "text-4xl": 36,
    "text-3xl": 30,
    "text-2xl": 24,
    "text-xl": 20,
    "text-lg": 18,
    "text-base": 16,
  };

  const maxPx = fontPxMap[fontSize] || 48;
  const minPx = parseFloat(((maxPx * 1200) / 1862).toFixed(2));

  return (
    <div
  className={`font-medium text-center mb-8 font-libre text-[#3A3A3A] ${className}`}
  style={{
    fontSize: `clamp(${minPx}px, calc(${minPx}px + (${maxPx - minPx}) * ((100vw - 1200px) / 662)), ${maxPx}px)`,
    lineHeight: `${fontSize === "text-5xl" ? 1 : "2.5rem"}`,
    WebkitTextStrokeWidth: "0.5px",
  }}
>
      <span className="inline-block pb-3">{title}</span>
      {showBorder && (
        <div className="border-b border-[#CBD5E1] w-full md:w-[40%] mx-auto mt-1"></div>
      )}
    </div>
  );
};

export default SectionHeading;
