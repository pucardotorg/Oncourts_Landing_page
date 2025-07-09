import React from "react";
import StickyHelpButton from "../../components/Utils/StickyHelpButton";
import HomeIntroVideo from "../../components/HomePage/HomeIntroVideo";
import InfoBanner from "../../components/InfoBanner";
import Highlights from "../../components/HomePage/Highlights";
import QuestionsSection from "../../components/HomePage/QuestionsSection";
import HomeCauseLists from "../../components/HomePage/HomeCauseLists";

const Hero = () => {
  return (
    <div className="w-full space-y-0 overflow-x-hidden">
      <InfoBanner messages={[]} />
      <StickyHelpButton />
      <HomeIntroVideo />
      <HomeCauseLists />
      <Highlights />
      <QuestionsSection />
    </div>
  );
};

export default Hero;
