import CustomCard from "../common/CustomCard";
import SectionHeading from "../common/SectionHeading";

export default function ONCourtsExperience() {
  const experiences = [
    {
      title: "Accessible & Predictable",
      description:
        "File cases, respond to summons, submit applications, and manage hearing dates—from anywhere, at any time. Understand when your case will advance with more certainty.",
    },
    {
      title: "Assisted & Empowering",
      description:
        "Get real-time updates on your case: amounts paid, next hearing date, summons status, & orders passed. Receive alerts for actions to be taken. Easily take action using templates, prompts, & dashboards.",
    },
    {
      title: "Seamless & Frictionless",
      description:
        "Optimise your time by eliminating the need to run pillar to post to sign documents, make payments, correct errors, send or track status of notices.",
    },
  ];
  return (
    <div className="py-16 bg-[#F0FDFA]" id="experience-section">
      <div className="container mx-auto px-4">
        <SectionHeading title="ON Courts Experience" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-5">
          {experiences.map((experience, index) => (
            <CustomCard
              key={index}
              title={experience.title}
              description={experience.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
