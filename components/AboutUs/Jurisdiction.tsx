import React from "react";
import SectionHeading from "../common/SectionHeading";
import Image from "next/image";
import FullscreenButton from "../common/FullscreenButton";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

export default function Jurisdiction({ isMobile }: { isMobile: boolean }) {
  const { t } = useSafeTranslation();
  return (
    <div className="py-10 md:py-16 bg-[#F0FDFA]" id="jurisdiction-section">
      <div className="container mx-auto px-5">
        <div className="mb-8">
          <SectionHeading title={t("JURISDICTION")} />
        </div>

        <div className="max-w-4xl mx-auto mb-8 font-roboto text-[20px] text-[#334155]">
          <p className="text-center px-1 md:px-4">
            {t("JURISDICTION_DESCRIPTION")}
          </p>
        </div>

        <div className="mt-8 md:mt-10">
          <div className="relative mx-auto w-full max-w-4xl rounded-lg overflow-hidden shadow-sm">
            {/* Map image with markers */}
            <div className="relative">
              <Image
                src="/images/policeStationsLocations.png"
                alt="Kollam District Map with Police Stations"
                width={1200}
                height={800}
                className="w-full h-auto"
                priority
              />

              {/* Fullscreen button */}
              <div className="absolute right-1 md:right-3 bottom-3 md:bottom-12">
                <FullscreenButton
                  url="/images/policeStationsLocations.png"
                  iconColor="#0F766E"
                  borderColor="#E2E8F0"
                  backgroundColor="white"
                  size={isMobile ? 50 : 70}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
