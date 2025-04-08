import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

type StatItem = {
  icon: string;
  value: number;
  label: string;
  suffix?: string;
};

const stats: StatItem[] = [
  { icon: "/images/file.png", value: 315, label: "Number of Cases Filed" },
  {
    icon: "/images/group.png",
    value: 184,
    label: "Unique Advocates Registered",
  },
  {
    icon: "/images/hammer.png",
    value: 17,
    suffix: " Days",
    label: "Average Number of Days Between Hearings",
  },
  {
    icon: "/images/support.png",
    value: 60,
    suffix: "%",
    label: "Support Requests Resolved",
  },
  {
    icon: "/images/graph.png",
    value: 90,
    suffix: "%",
    label: "of cases moving from “Filing” to “Registration” Stage under 3 days",
  },
];

const ImpactGlance: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div
      ref={ref}
      className="px-6 md:px-16 py-20 min-h-[500px] flex items-center"
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-teal">
          Impact at a Glance
        </h2>
        <p className="text-darkGrey mt-2 mb-6 text-lg md:text-xl lg:text-2xl xl:text-[25px] leading-[150%] tracking-[0%] text-center font-raleway font-normal mt-5">
          Key performance indicators reflecting the efficiency and effectiveness
          of 24x7 ON Courts.
        </p>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-2">
          {stats.slice(0, 3).map((stat, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center py-4 px-6 ${
                index < 2 ? "border-r border-gray-300" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 md:w-24 md:h-24">
                  <Image
                    src={stat.icon}
                    alt={stat.label}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-6xl font-bold text-teal whitespace-nowrap font-noto">
                  {inView ? (
                    <CountUp start={0} end={stat.value} duration={2.5} />
                  ) : (
                    "0"
                  )}{" "}
                  {stat.suffix}
                </p>
              </div>
              <p className="text-darkGrey text-lg mt-2 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="relative my-8">
          <div className="absolute top-1/2 left-1/2 w-3/4 border-t-[1px] border-gray-300 transform -translate-x-1/2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 mt-8 justify-center">
          {stats.slice(3).map((stat, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center px-6 ${index < 1 ? "border-r border-gray-300" : ""}`}
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 md:w-24 md:h-24">
                  <Image
                    src={stat.icon}
                    alt={stat.label}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-6xl font-bold text-teal min-w-[80px] font-noto">
                  {inView ? (
                    <CountUp start={0} end={stat.value} duration={2.5} />
                  ) : (
                    "0"
                  )}
                  {stat.suffix || ""}
                </p>
              </div>
              <p className="text-darkGrey text-lg mt-2 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImpactGlance;
