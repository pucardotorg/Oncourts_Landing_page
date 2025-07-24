import React, { useState } from "react";
import Head from "next/head";
import SectionHeading from "../../components/common/SectionHeading";
import ResourceItem from "../../components/common/ResourceItem";
import { contactInfoData, getFaqs } from "../../data/ContactInfoData";
import FAQItem from "../../components/common/FAQItem";
import { useMediaQuery } from "@mui/system";
import { svgIcons } from "../../data/svgIcons";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

const HelpResources = () => {
  const { t } = useSafeTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = getFaqs(t);
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const isMobile = useMediaQuery("(max-width: 640px)");

  // Using contact information data from external file

  return (
    <>
      <Head>
        <title>{t("HELP_RESOURCES")}</title>
        <meta
          name="description"
          content="Access everything you need to navigate 24x7 ON Courts seamlessly. Submit feedback or support requests and explore step-by-step tutorials and guides."
        />
      </Head>

      <div className="py-8 md:py-12 bg-white">
        <div className="w-full md:w-[98%] mx-auto">
          <div className="px-6 md:px-20">
            <SectionHeading
              title={t("HELP_RESOURCES")}
              fontSize={isMobile ? "text-[3rem]" : "text-[4rem]"}
              className="mb-6"
              showBorder={false}
            />

            <div className="font-normal text-xl md:text-2xl flex flex-col md:flex-row mb-12 gap-6">
              <div className="font-roboto md:w-[70%] text-[#334155] content-center text-center md:text-left">
                {t("ACCESS_EVERYTHING_YOU_NEED")}
              </div>
              <div className="flex flex-row gap-4 md:w-[30%] bg-[#F8FAFC] p-4 lg:py-[12px] lg:px-[24px] rounded-[23.31px] shadow-sm items-center justify-center drop-shadow-[0px_2.003px_6.009px_rgba(0,0,0,0.1)]">
                <span className="font-roboto text-[60px] sm:text-[80px] lg:text-[102.30px] lg:leading-[141.11px] font-bold text-[#0F766E] shrink-0">
                  7
                </span>
                <div className="font-libre text-lg sm:text-xl md:text-2xl lg:text-[34.96px] lg:leading-[46px] text-[#334155] break-words hyphens-none">
                  {t("DAYS_TO_SUPPORT_RESOLUTION")}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {/* Support & Feedback Section */}
              <ResourceItem
                t={t}
                heading={"SUPPORT_FEEDBACK"}
                items={[
                  {
                    icon: "/images/file.png",
                    text: "SUPPORT_FORM",
                    link: "https://forms.gle/uCSgGiqGiMQYjjgeA",
                    section: "Support Form",
                    newTab: true,
                  },
                  {
                    icon: "/images/file.png",
                    text: "FEEDBACK_SURVEY_FORM",
                    link: "https://docs.google.com/forms/d/e/1FAIpQLSdsNBhg-9YYs-HKFja_UwUc7ZV38BItLgb7If4kWwTURMqXOg/viewform",
                    section: "Feedback survey form",
                    newTab: true,
                  },
                ]}
              />

              {/* Resources Section */}
              <ResourceItem
                t={t}
                heading="RESOURCES"
                items={[
                  {
                    icon: "/images/file.png",
                    text: "USER_GUIDE_FOR_ADVOCATES_CLERKS_AND_LITIGANTS",
                    link: "https://drive.google.com/file/d/1j4mIw0K2F8m_urJE-zbu-oeluiOL-8Pg/view",
                    section: "User Guide for Advocates, Clerks & Litigants",
                    newTab: true,
                  },
                  {
                    icon: "/images/file.png",
                    text: "VIDEO_TUTORIALS",
                    link: "/video-tutorials",
                    section: "Video tutorials",
                    newTab: false,
                  },
                ]}
              />
            </div>
          </div>
          {!isMobile && (
            <div className="border-b border-[#CBD5E1] w-full mx-auto mt-1"></div>
          )}

          {/* FAQ Section */}
          <div id="faq" className="my-16 pb-8 md:pb-0 bg-[#F0FDFA] md:bg-white">
            <SectionHeading
              title={t("FREQUENTLY_ASKED_QUESTIONS")}
              fontSize="text-4xl"
              className="mb-8 pt-6 md:pt-0 px-6 md:px-0"
            />
            <div className="font-roboto px-6 md:px-20">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaq === index}
                  onClick={() => toggleFaq(index)}
                />
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div id="contactUs">
            <SectionHeading
              title={t("NEED_FURTHER_ASSISTANCE")}
              fontSize="text-4xl"
              className="mb-8"
            />

            <div className="font-roboto px-6 md:px-20 pb-20 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {contactInfoData.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="p-3 mt-1">
                    {svgIcons[item?.icon] &&
                      React.createElement(svgIcons[item.icon])}
                  </div>
                  <div className="font-medium text-xl flex flex-wrap align-center gap-1">
                    <div className="font-medium  mb-1">{t(item.title)}</div>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0F766E] font-semibold"
                      >
                        {t(item.content)}
                      </a>
                    ) : (
                      item.content && (
                        <div className="text-[#0F766E] font-semibold">
                          {item.title ? item.content : t(item.content)}
                        </div>
                      )
                    )}
                    {item.subContent && (
                      <div className="text-[#0F766E] font-semibold">
                        {t(item.subContent)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpResources;
