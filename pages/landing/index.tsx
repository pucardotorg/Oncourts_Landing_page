import React from "react";
import NoticeAndCauseListSection from "../../components/HomePage/NoticeAndCauseListSection";
import Support from "../../components/HomePage/Support";
import ImpactGlance from "../../components/HomePage/ImpactGlance";
import TestimonialCarousel from "../../components/HomePage/TestimonialCarousel";
import WhatsNewSections from "../../components/HomePage/WhatNewSections";
import StickyHelpButton from "../../components/Utils/StickyHelpButton";
import HomeIntroVideo from "../../components/HomePage/HomeIntroVideo";
import InfoBanner from "../../components/InfoBanner";
import Highlights from "../../components/HomePage/Highlights";
import QuestionsSection from "../../components/HomePage/QuestionsSection";

const Hero = () => {
  return (
    <div className="w-full space-y-0 overflow-x-hidden">
      <InfoBanner messages={[]} />
      <StickyHelpButton />
      <HomeIntroVideo />
      <Highlights />
      <QuestionsSection />
      {/* <NoticeAndCauseListSection /> */}
      {/* <WhatsNewSections /> */}
      {/* <ImpactGlance />
      <TestimonialCarousel /> */}
      {/* <Support /> */}
    </div>
  );
};

export default Hero;
