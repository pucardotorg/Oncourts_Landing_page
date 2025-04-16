import React from "react";
import Carousel from "../../components/HomePage/Carousel";
import NoticeAndCauseListSection from "../../components/HomePage/NoticeAndCauseListSection";
import Support from "../../components/HomePage/Support";
import ImpactGlance from "../../components/HomePage/ImpactGlance";
import TestimonialCarousel from "../../components/HomePage/TestimonialCarousel";
import WhatsNewSections from "../../components/HomePage/WhatNewSections";
import StickyHelpButton from "../../components/StickyHelpButton";

const Hero = () => {
  return (
    <div className="w-full space-y-0 overflow-x-hidden">
      <StickyHelpButton />
      <Carousel />
      <NoticeAndCauseListSection />
      <WhatsNewSections />
      <ImpactGlance />
      <TestimonialCarousel />
      <Support />
    </div>
  );
};

export default Hero;
