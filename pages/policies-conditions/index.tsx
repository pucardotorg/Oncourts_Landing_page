import React from "react";
import SectionHeading from "../../components/common/SectionHeading";
import { policySections } from "../../data/PoliciesData";
import { useMediaQuery } from "@mui/material";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

const Policies = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { t } = useSafeTranslation();
  return (
    <main className="pt-20 pb-40 bg-white text-[#334155] text-lg md:text-2xl">
      <div className="w-full mx-auto space-y-12">
        {policySections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className="md:px-16 px-6 space-y-6 scroll-mt-24"
          >
            <SectionHeading
              title={t(section.title)}
              className="!text-left"
              fontSize={isMobile ? "text-3xl" : "text-[40px]"}
              showBorder={false}
            />
            <ol className="font-roboto list-decimal pl-6 space-y-4 last:pb-0 pb-10 last:border-b-0 border-b border-[#CBD5E1]">
              {section.data.map((item, index) => (
                <li key={index}>
                  <p>{t(item.text)}</p>
                </li>
              ))}
            </ol>
            {index !== policySections.length - 1 && <span></span>}
          </section>
        ))}
      </div>
    </main>
  );
};

export default Policies;
