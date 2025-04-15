import React, { useEffect, useState, } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { transformImpactGlance } from "../../TransformData/transformResponseData";

export interface DashboardMetrics {
  id: string;
  numberOfCasesFiled: number;
  numberOfAdvocatesRegistered: number;
  percentageOfSupportRequestsResolved: number;
  averageNumberOfDaysBetweenHearingsForCase: number;
  percentageOfCasesMovedFromFilingToRegistrationUnder3Days: number;
}

const dashboardStatsMap = (data: DashboardMetrics | undefined) => {
  if (!data) return [];

  return [
    {
      label: "Number of Cases Filed",
      value: data.numberOfCasesFiled,
      suffix: "",
      icon: "/images/file.png",
    },
    {
      label: "Unique Advocates Registered",
      value: data.numberOfAdvocatesRegistered,
      suffix: "",
      icon: "/images/group.png",
    },
    {
      label: "Average Number of Days Between Hearings",
      value: data.averageNumberOfDaysBetweenHearingsForCase,
      suffix: "",
      icon: "/images/hammer.png",
    },
    {
      label: "Support Requests Resolved",
      value: data.percentageOfSupportRequestsResolved,
      suffix: "%",
      icon: "/images/support.png",
    },
    {
      label: "of cases moving from “Filing” to “Registration” Stage under 3 days",
      value: data.percentageOfCasesMovedFromFilingToRegistrationUnder3Days,
      suffix: "%",
      icon: "/images/graph.png",
    },
  ];
};

const ImpactGlance: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [stats, setStats] = useState<DashboardMetrics>();
  const statItems = dashboardStatsMap(stats);

  useEffect(() => {
    const fetchImpactGlance = async () => {
      try {
        const res = await fetch("/api/impactGlance");
        const data = await res.json();

        const transformed = transformImpactGlance(data);
        setStats(transformed?.stats || []);
      } catch (error) {
        console.error("Failed to fetch Whats New data", error);
      }
    };

    fetchImpactGlance();
  }, []);

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
          {statItems.slice(0, 3).map((stat, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center py-4 px-6 ${index < 2 ? "border-r border-gray-300" : ""
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
          {statItems.slice(3).map((stat, index) => (
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
