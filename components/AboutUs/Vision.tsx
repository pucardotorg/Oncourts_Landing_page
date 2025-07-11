import React from "react";
import SectionHeading from "../common/SectionHeading";
import Image from "next/image";
import FullscreenButton from "../common/FullscreenButton";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

export default function Vision() {
  const videoId = "EDDAkm4FvBc";
  const { t } = useSafeTranslation();

  return (
    <div className="py-10 md:py-16 bg-white" id="vision-section">
      <div className="container mx-auto px-5">
        <div className="mb-8">
          <SectionHeading title={t("VISION")} />
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-stretch">
          <div className="text-center md:text-left md:w-1/2 text-[20px] lg:text-[22px] font-[Roboto] font-normal text-[#334155]">
            <p className="mb-5">{t("VISION_DESCRIPTION_1")}</p>
            <p className="mb-5">{t("VISION_DESCRIPTION_2")}</p>
            <a
              href="https://docs.google.com/document/d/109ZayX_-WRr87k69m3GSEiqtgSnziWtnW08SxUZEIGQ/edit?tab=t.0#heading=h.hxgglwufvkno"
              className="inline-flex items-center bg-[#0F766E] text-white py-2 md:py-3 px-4 md:px-6 rounded-md hover:bg-[#0F766E]/80 transition-colors text-base md:text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{t("ON_COURTS_JOURNEY")}</span>
              <Image
                src="/images/rightArrow.png"
                alt="Arrow right"
                width={16}
                height={16}
                className="ml-2"
              />
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
              <div className="absolute bottom-3 right-3">
                <FullscreenButton
                  url={`https://www.youtube.com/watch?v=${videoId}`}
                  iconColor="#FFFFFF"
                  borderColor="#4B5563"
                  backgroundColor="rgba(0,0,0,0.5)"
                  size={40}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
