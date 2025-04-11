import React from "react";
import CourtListingSection from "./CourtListingSection";
import { sampleCaseItems, sampleNoticeItems } from "../../data/courtListingData";

const NoticeAndCauseListSection: React.FC = () => {
    return (
      <CourtListingSection 
        caseItems={sampleCaseItems}
        noticeItems={sampleNoticeItems}
      />
    )
};

export default NoticeAndCauseListSection;
