import React from "react";
import SectionHeading from "../common/SectionHeading";
import { svgIcons } from "../../data/svgIcons";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

export default function Vision() {
  const videoId = "EDDAkm4FvBc";
  const { t } = useSafeTranslation();

  return (
    <div className="py-10 md:py-16 bg-white" id="vision-section">
      <div className="container mx-auto max-w-[95%] px-5">
        <div className="mb-8">
          <SectionHeading title={t("VISION")} />
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-stretch">
          <div className="text-center md:text-left md:w-1/2 text-[20px] lg:text-[22px] font-roboto font-normal text-[#334155]">
            <p className="mb-5">{t("VISION_DESCRIPTION_1")}</p>
            <p className="mb-5">{t("VISION_DESCRIPTION_2")}</p>
            <a
              href="https://drive.google.com/file/d/1lUJA_CbDuRUd3Rk7Sn6Ws2NiI6L4d5aM/view"
              className="inline-flex items-center bg-[#0F766E] text-white text-lg md:text-[28px] md:leading-[32px] md:tracking-[-0.56px] font-medium py-3 px-6 rounded-md hover:bg-[#0F766E]/80 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-5 h-5 mr-4 flex-shrink-0 flex items-center justify-center">
                <svgIcons.ArrowIcon color="#FFFFFF" />
              </div>
              <span>{t("ON_COURTS_JOURNEY")}</span>
            </a>
          </div>
          <div className="md:w-1/2 mt-6 md:mt-0">
            <div className="relative rounded-md overflow-hidden shadow-lg aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                title="ON Courts Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              {/* <div className="absolute bottom-3 right-3">
                <FullscreenButton
                  url={`https://www.youtube.com/watch?v=${videoId}`}
                  videoId={videoId}
                  iconColor="#FFFFFF"
                  borderColor="#4B5563"
                  backgroundColor="rgba(0,0,0,0.5)"
                  size={40}
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
