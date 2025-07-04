import React from "react";
import Image from "next/image";
import DetailCard from "../common/DetailCard";
import SectionHeading from "../common/SectionHeading";

export default function Benefits() {
  const benefitsData = [
    {
      heading: "Litigants",
      icon: (
        <div className="relative w-12 h-12 flex items-center justify-center">
          <Image
            src="/images/person.svg"
            alt="Litigants Icon"
            width={40}
            height={40}
            style={{ color: "#0F766E" }}
          />
        </div>
      ),
      points: [
        "Get proactive alerts (SMS) on case status and action to be taken",
        "Access case files and track progress using unique logins",
        "Avoid visits to advocates for document signing",
      ],
    },
    {
      heading: "Lawyers",
      icon: (
        <div className="relative w-12 h-12 flex items-center justify-center">
          <Image
            src="/images/advocate.svg"
            alt="Lawyers Icon"
            width={35}
            height={35}
            style={{ color: "#0F766E" }}
          />
        </div>
      ),
      points: [
        "File cases remotely via digitally native & rule-based system",
        "Get proactive alerts on case updates and action to be taken",
        "Make payments digitally through the platform",
      ],
    },
    {
      heading: "Judge",
      icon: (
        <div className="relative w-12 h-12 flex items-center justify-center">
          <Image
            src="/images/judge.svg"
            alt="Judges Icon"
            width={40}
            height={40}
            style={{ color: "#0F766E" }}
          />
        </div>
      ),
      points: [
        "Access needed case information digitally",
        "Issue orders using pre-defined templates",
        "Sign orders in bulk using digital signatures",
      ],
    },
    {
      heading: "Court Staff",
      icon: (
        <div className="relative w-12 h-12 flex items-center justify-center">
          <Image
            src="/images/justice.svg"
            alt="Registry Icon"
            width={35}
            height={35}
            style={{ color: "#0F766E" }}
          />
        </div>
      ),
      points: [
        "Perform scrutiny remotely with system assistance",
        "Auto-generate, track & deliver processes via multiple channels",
        "Avoid manual entry of data across case workflows",
      ],
    },
  ];

  return (
    <div className="py-16 bg-white" id="benefits-section">
      <div className="container mx-auto px-4">
        <SectionHeading title="Benefits" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
          {benefitsData.map((benefit, index) => (
            <DetailCard
              key={index}
              heading={benefit.heading}
              icon={benefit.icon}
              points={benefit.points}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
