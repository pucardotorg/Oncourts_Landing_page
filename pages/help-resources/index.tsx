import React, { useState } from "react";
import Head from "next/head";
import SectionHeading from "../../components/common/SectionHeading";
import ResourceItem from "../../components/common/ResourceItem";
import { contactInfoData, faqs } from "../../data/ContactInfoData";
import FAQItem from "../../components/common/FAQItem";
import { useMediaQuery } from "@mui/system";
import { svgIcons } from "../../data/svgIcons";

const HelpResources = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const isMobile = useMediaQuery("(max-width: 768px)");

  // Using contact information data from external file

  return (
    <>
      <Head>
        <title>Help & Resources | ON Courts</title>
        <meta
          name="description"
          content="Access everything you need to navigate 24x7 ON Courts seamlessly. Submit feedback or support requests and explore step-by-step tutorials and guides."
        />
      </Head>

      <div className="py-8 md:py-12 bg-white">
        <div className="w-full md:w-[90%] mx-auto">
          <div className="px-6 md:px-20">
            <SectionHeading
              title="Help & Resources"
              fontSize={isMobile ? "text-[3rem]" : "text-[4rem]"}
              className="mb-6"
              showBorder={false}
            />

            <div className="font-[Roboto] font-normal text-xl md:text-2xl flex flex-col md:flex-row mb-12 gap-6">
              <div className="md:w-[70%] text-[#334155] content-center text-center md:text-left">
                Access everything you need to navigate 24x7 ON Courts
                seamlessly. Submit feedback or support requests and explore
                step-by-step tutorials and guides.
              </div>
              <div className="flex flex-row gap-6 md:w-[30%] bg-[#F8FAFC] p-6 rounded-xl shadow-sm border border-[#CBD5E1] items-center justify-center">
                <span className="text-[72px] font-bold text-[#0F766E]">7</span>
                <span className="text-3xl text-[#334155]">
                  Days to Support Resolution
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {/* Support & Feedback Section */}
              <ResourceItem
                heading="Support & Feedback"
                items={[
                  {
                    icon: "/images/file.png",
                    text: "Support Form",
                    link: "https://forms.gle/uCSgGiqGiMQYjjgeA",
                    section: "Support Form",
                    newTab: true,
                  },
                  {
                    icon: "/images/file.png",
                    text: "Feedback survey form",
                    link: "https://docs.google.com/forms/d/e/1FAIpQLSdsNBhg-9YYs-HKFja_UwUc7ZV38BItLgb7If4kWwTURMqXOg/viewform",
                    section: "Feedback survey form",
                    newTab: true,
                  },
                ]}
              />

              {/* Resources Section */}
              <ResourceItem
                heading="Resources"
                items={[
                  {
                    icon: "/images/file.png",
                    text: "User Guide for Advocates, Clerks & Litigants",
                    link: "https://drive.google.com/file/d/1j4mIw0K2F8m_urJE-zbu-oeluiOL-8Pg/view",
                    section: "User Guide for Advocates, Clerks & Litigants",
                    newTab: true,
                  },
                  {
                    icon: "/images/file.png",
                    text: "Video tutorials",
                    link: "#",
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
              title="Frequently Asked Questions"
              fontSize="text-4xl"
              className="mb-8 pt-6 md:pt-0 px-6 md:px-0"
            />
            <div className="font-[Roboto] px-6 md:px-20">
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
              title="Need Further Assistance? Contact Us!"
              fontSize="text-4xl"
              className="mb-8"
            />

            <div className="font-[Roboto] px-6 md:px-20 pb-20 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {contactInfoData.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="p-3 mt-1">
                    {svgIcons[item?.icon] &&
                      React.createElement(svgIcons[item.icon])}
                  </div>
                  <div className="font-medium text-xl flex flex-wrap align-center gap-1">
                    <div className="font-medium  mb-1">{item.title}</div>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-[#0F766E] font-semibold"
                      >
                        {item.content}
                      </a>
                    ) : (
                      item.content && (
                        <div className="text-[#0F766E] font-semibold">
                          {item.content}
                        </div>
                      )
                    )}
                    {item.subContent && (
                      <div className="text-[#0F766E] font-semibold">
                        {item.subContent}
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
