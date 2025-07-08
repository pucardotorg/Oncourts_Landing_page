import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import SectionHeading from "../common/SectionHeading";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

const UserVoices: React.FC = () => {
  const { t } = useSafeTranslation();
  // Testimonial data
  const testimonials = [
    {
      name: "Asha G.V",
      designation: "ADVOCATE",
      quote: "ASHA_TESTIMONIAL",
      photo: "/images/asha.jpg",
    },
    {
      name: "Beena M.",
      designation: "ADVOCATE",
      quote: "BEENA_TESTIMONIAL",
      photo: "/images/beena.jpg",
    },
    {
      name: "Karthika S.",
      designation: "ADVOCATE",
      quote: "KARTHIKA_TESTIMONIAL",
      photo: "/images/singlePerson.png",
    },
  ];

  // State for active testimonial index and hover state
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide functionality
  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, testimonials.length]);

  // Navigation functions
  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const goToPrevious = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="relative bg-white z-10" id="user-voices-section">
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#3A3A3A] z-0"
        aria-hidden="true"
      />
      <div className="container mx-auto px-0 md:px-4 relative z-10">
        {/* Carousel Container */}
        <div
          className="mx-auto bg-white border border-[#E2E8F0] md:rounded-xl shadow-xl p-8 overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <SectionHeading title={t("USER_VOICES")} />

          {/* Testimonial */}
          <div className="mt-20 flex flex-col items-center transition-opacity duration-500">
            {/* Avatar row with navigation - 3 column grid */}
            <div className="grid grid-cols-12 items-center mb-10 py-4 gap-4 w-full">
              {/* Left column with previous button */}
              <div className="col-span-1 flex justify-center">
                <button
                  onClick={goToPrevious}
                  className="text-[#CBD5E1] hover:text-[#0F766E] transition-colors"
                  aria-label="Previous testimonial"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* Middle column with avatar images */}
              <div
                className="col-span-10 flex justify-center items-center relative"
                ref={(el) => {
                  // Store a reference to calculate responsive spacing
                  if (el) {
                    // This ensures we only calculate on mount and not on every render
                    if (!el.dataset.initialized) {
                      el.dataset.initialized = "true";
                    }
                  }
                }}
              >
                {testimonials.map((testimonial, idx) => {
                  // Calculate position based on distance from active index
                  const distance =
                    (((idx - activeIndex) % testimonials.length) +
                      testimonials.length) %
                    testimonials.length;
                  const adjustedDistance =
                    distance > testimonials.length / 2
                      ? distance - testimonials.length
                      : distance;

                  // Determine if item should be visible and its position
                  const isActive = idx === activeIndex;
                  const isVisible = Math.abs(adjustedDistance) <= 2; // Show 2 items on each side

                  if (!isVisible) return null;

                  // Calculate position using percentages instead of fixed pixels
                  let positionClass = "";
                  if (adjustedDistance === 0) {
                    positionClass = "left-[50%] -translate-x-1/2"; // Center
                  } else if (adjustedDistance === -1) {
                    positionClass = "left-[35%] -translate-x-1/2"; // First left
                  } else if (adjustedDistance === -2) {
                    positionClass = "left-[25%] -translate-x-1/2"; // Second left
                  } else if (adjustedDistance === 1) {
                    positionClass = "left-[65%] -translate-x-1/2"; // First right
                  } else if (adjustedDistance === 2) {
                    positionClass = "left-[75%] -translate-x-1/2"; // Second right
                  }

                  return (
                    <div
                      key={idx}
                      className={`absolute transition-all duration-300 ${positionClass}`}
                      style={{
                        zIndex: isActive ? 10 : 5,
                      }}
                    >
                      <div
                        className={`bg-white rounded-full overflow-hidden transition-all duration-300 ${isActive ? "p-3 border-4 border-[#0F766E]" : ""}`}
                        style={{
                          width: isActive ? 160 : 90,
                          height: isActive ? 160 : 90,
                        }}
                        onClick={() => goToSlide(idx)}
                      >
                        <div className="relative w-full h-full rounded-full overflow-hidden">
                          {testimonial.photo && (
                            <Image
                              src={testimonial.photo}
                              alt={testimonial.name}
                              fill
                              className="rounded-full object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              priority={isActive}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right column with next button */}
              <div className="col-span-1 flex justify-center">
                <button
                  onClick={goToNext}
                  className="text-[#CBD5E1] hover:text-[#0F766E] transition-colors"
                  aria-label="Next testimonial"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Name and designation */}
            <div className="mt-8 flex justify-center items-center text-[#3A3A3A] font-medium font-[Roboto] text-[24px] md:text-[28px] w-full mb-3">
              <div className="flex w-full max-w-2xl">
                <div className="w-[47.5%] text-right">
                  {testimonials[activeIndex].name}
                </div>
                <div className="w-[5%] text-center">|</div>
                <div className="w-[47.5%] text-left">
                  {t(testimonials[activeIndex].designation)}
                </div>
              </div>
            </div>
            {/* Quote */}
            <p className="text-[19px] md:text-[21px] text-center text-[#334155] font-[Roboto] max-w-4xl">
              {t(testimonials[activeIndex].quote)}
            </p>

            {/* Navigation dots */}
            <div className="flex space-x-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  className={`h-3 w-3 rounded-full transition-all ${
                    idx === activeIndex ? "bg-[#3A3A3A]" : "bg-[#64748B]"
                  }`}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserVoices;
