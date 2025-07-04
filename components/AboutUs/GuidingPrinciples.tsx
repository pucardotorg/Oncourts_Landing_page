import React from "react";
import SectionHeading from "../common/SectionHeading";
import CustomCard from "../common/CustomCard";

export default function GuidingPrinciples() {
  // Principles data
  const principles = [
    {
      title: "People Centric",
      description:
        "Understand user needs and prioritise changes to make their experience seamless, predictable and efficient. Engage users for continuous improvement.",
    },
    {
      title: "Open",
      description:
        "Make information open and actionable to the users, adopt open technology, and provide access to data, subject to privacy and security policies.",
    },
    {
      title: "Networked Ecosystem",
      description:
        "Integrate with allied institutions for real-time seamless communication and enable Open APIs to invite ecosystem participation.",
    },
  ];

  return (
    <div className="py-16 bg-[#F0FDFA]" id="guiding-principles-section">
      <div className="container mx-auto px-4">
        <SectionHeading title="Guiding Principles" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-5">
          {principles.map((principle, index) => (
            <CustomCard
              key={index}
              title={principle.title}
              description={principle.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
