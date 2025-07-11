import React from "react";
import SectionHeading from "../common/SectionHeading";
import CustomCard from "../common/CustomCard";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

export default function GuidingPrinciples() {
  const { t } = useSafeTranslation();
  // Principles data
  const principles = [
    {
      title: "PEOPLE_CENTRIC",
      description: "PEOPLE_CENTRIC_DESCRIPTION",
    },
    {
      title: "OPEN",
      description: "OPEN_DESCRIPTION",
    },
    {
      title: "NETWORKED_ECOSYSTEM",
      description: "NETWORKED_ECOSYSTEM_DESCRIPTION",
    },
  ];

  return (
    <div className="py-16 bg-[#F0FDFA]" id="guiding-principles-section">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("GUIDING_PRINCIPLES")} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-5">
          {principles.map((principle, index) => (
            <CustomCard
              key={index}
              title={t(principle.title)}
              description={t(principle.description)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
