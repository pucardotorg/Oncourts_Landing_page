import CustomCard from "../common/CustomCard";
import SectionHeading from "../common/SectionHeading";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

export default function ONCourtsExperience() {
  const { t } = useSafeTranslation();
  const experiences = [
    {
      title: "ACCESSIBLE_AND_PREDICTABLE",
      description: "ACCESSIBLE_AND_PREDICTABLE_DESCRIPTION",
    },
    {
      title: "ASSISTED_AND_EMPOWERING",
      description: "ASSISTED_AND_EMPOWERING_DESCRIPTION",
    },
    {
      title: "SEAMLESS_AND_FRICTIONLESS",
      description: "SEAMLESS_AND_FRICTIONLESS_DESCRIPTION",
    },
  ];
  return (
    <div className="py-16 bg-[#F0FDFA]" id="experience-section">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("ON_COURTS_EXPERIENCE")} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-5">
          {experiences.map((experience, index) => (
            <CustomCard
              key={index}
              title={t(experience.title)}
              description={t(experience.description)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
