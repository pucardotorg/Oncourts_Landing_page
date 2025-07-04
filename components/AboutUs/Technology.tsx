import React from "react";
import SectionHeading from "../common/SectionHeading";
import Image from "next/image";

export default function Technology() {
  return (
    <div className="py-16 bg-white relative" id="technology-section">
      <div
        className="absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage:
            "url('/images/technology.svg'), url('/images/technology.svg')",
          backgroundPosition: "left center, right center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "40% 100%, 40% 100%",
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading title="Technology" />

        <div className="font-[Roboto] max-w-5xl mx-auto text-center">
          <p className="text-[20px] font-normal text-[#334155] mb-8">
            ON Courts is powered by DRISTI, an open source case management
            platform. DRISTI is freely available to everyone and provides
            reusable building blocks for essential functions such as e-filing,
            document scrutiny, and case management. DRISTI has been configured
            to suit the context in Kerala, particularly for cheque dishonour
            cases.
          </p>

          <a
            href="#"
            className="inline-flex items-center bg-[#0F766E] text-white text-[28px] font-medium py-3 px-6 rounded-md hover:bg-[#0F766E]/80 transition-colors"
          >
            Git book
            <Image
              src="/images/rightArrow.png"
              alt="Arrow right"
              width={20}
              height={20}
              className="ml-2"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
