import React, { useEffect } from "react";
import Image from "next/image";

interface PersonCardProps {
  imagePath: string;
  name: string;
  title: string;
  className?: string;
  cardHeight?: number;
  setMaxHeight?: (height: number) => void;
}

const PersonCard: React.FC<PersonCardProps> = ({
  imagePath,
  name,
  title,
  className = "",
  cardHeight,
  setMaxHeight,
}) => {
  // No need to track local content height since we're using the parent's max height
  const textRef = React.useRef<HTMLDivElement>(null);

  // Report this card's height to parent for uniform sizing
  useEffect(() => {
    if (textRef.current && setMaxHeight) {
      const height = textRef.current.scrollHeight;
      setMaxHeight(height);
    }
  }, [name, title, setMaxHeight]);

  return (
    <div className={`flex flex-col ${className} w-full max-w-[350px]`}>
      <div className="w-full bg-white border border-[#CBD5E1] rounded-md overflow-hidden shadow-sm flex flex-col">
        {/* Image container - fixed aspect ratio and dimensions */}
        <div className="relative w-full aspect-[3.5/4.5] border-b border-[#CBD5E1]">
          {imagePath ? (
            <Image
              src={imagePath}
              alt={name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center border-b border-[#CBD5E1]">
              <div>
                <Image
                  src="/images/singlePerson.png"
                  alt={name}
                  width={100}
                  height={100}
                  // className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
          )}
        </div>

        {/* Text container with fixed height based on the tallest card */}
        <div
          ref={textRef}
          className="py-3 px-2 flex flex-col justify-center items-center overflow-auto"
          style={{ height: cardHeight ? `${cardHeight}px` : "auto" }}
        >
          <h3 className="text-base md:text-xl lg:text-[24px] font-medium font-[Baskerville] text-[#0F766E] w-full text-center break-words">
            {name}
          </h3>
          <p className="text-sm md:text-base lg:text-[20px] font-[Roboto] text-[#3A3A3A] text-center w-full break-words">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonCard;
