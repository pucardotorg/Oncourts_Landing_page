import React from "react";
import Image from "next/image";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

interface VideoTutorial {
  id: string;
  title: string;
  videoId?: string;
  category:
    | "general"
    | "complainant"
    | "accused"
    | "know-your-case"
    | "screen-walkthrough";
}

interface VideoCategory {
  id: string;
  title: string;
  videos: VideoTutorial[];
}

const videoCategories: VideoCategory[] = [
  {
    id: "general",
    title: "GENERAL_VIDEOS",
    videos: [
      {
        id: "user-registration",
        title: "USER_REGISTRATION_AND_LOGIN",
        category: "general",
        videoId: "ka7KPcPVDe0",
      },
      {
        id: "home-screen",
        title: "HOME_SCREEN_VIDEO_TUTORIAL",
        category: "general",
        videoId: "YqmvFNhjDdk",
      },
      {
        id: "view-case",
        title: "VIEW_A_CASE_VIDEO_TUTORIAL",
        category: "general",
        videoId: "5kmtfjHpEJQ",
      },
      {
        id: "submissions-extensions-and-responses",
        title: "SUBMISSIONS_EXTENSIONS_AND_RESPONSES_VIDEO_TUTORIAL",
        category: "general",
        videoId: "smP5T8V9MCc",
      },
      {
        id: "calendar-management-scheduling-and-rescheduling",
        title: "CALENDAR_MANAGEMENT_SCHEDULING_AND_RESCHEDULING_VIDEO_TUTORIAL",
        category: "general",
        videoId: "DXCcVvkkMqs",
      },
      {
        id: "hearing-management",
        title: "HEARING_MANAGEMENT_VIDEO_TUTORIAL",
        category: "general",
        videoId: "aYOEFSMzGgw",
      },
      {
        id: "order-and-judgement",
        title: "ORDER_AND_JUDGEMENT_VIDEO_TUTORIAL",
        category: "general",
        videoId: "u-HqgM1tLtA",
      },
    ],
  },
  {
    id: "complainant",
    title: "COMPLAINANT_SIDE",
    videos: [
      {
        id: "file-case-complainant",
        title: "FILE_CASE_COMPLAINANT_VIDEO_TUTORIAL",
        category: "complainant",
        videoId: "p9Ey6Ea3AXg",
      },
      {
        id: "defect-correction",
        title: "DEFECT_CORRECTION_VIDEO_TUTORIAL",
        category: "complainant",
        videoId: "_aJ0qYYebKA",
      },
      {
        id: "process-management",
        title: "PROCESS_MANAGEMENT_VIDEO_TUTORIAL",
        category: "complainant",
        videoId: "RYF-krKyLBU",
      },
    ],
  },
  {
    id: "accused",
    title: "ACCUSED_SIDE",
    videos: [
      {
        id: "join-case",
        title: "JOIN_CASE_VIDEO_TUTORIAL",
        category: "accused",
        videoId: "w_gL0YsG8X0",
      },
      {
        id: "bail",
        title: "BAIL_VIDEO_TUTORIAL",
        category: "accused",
        videoId: "2VxsJI_eqgY",
      },
    ],
  },
];

const VideoTutorials: React.FC = () => {
  const { t } = useSafeTranslation();
  return (
    <div className="py-8 bg-white px-4">
      <div className="w-[95%] md:w-[90%] mx-auto">
        {/* Page Title */}
        <div className="text-center mb-12 border-b border-[#E5E7EB] pb-6">
          <h1 className="font-libre not-italic font-normal text-[40px] md:text-[64px] leading-[46px] md:leading-[70px] text-center tracking-[-0.8px] text-[#3A3A3A]">
            {t("VIDEO_TUTORIALS_HEADER")}
          </h1>
          <p className="mt-4 font-roboto not-italic font-normal text-[20px] md:text-[28px] leading-[28px] md:leading-[40px] text-center tracking-[-0.56px] text-[#334155]">
            {t("VIDEO_TUTORIALS_DESCRIPTION")}
          </p>
        </div>

        {/* Video Categories */}
        <div className="space-y-12">
          {videoCategories.map((category) => (
            <div key={category.id} className="mb-8">
              <h2 className="font-libre not-italic font-normal text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] text-[#3A3A3A] mb-6 md:mb-8">
                {t(category.title)}
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-x-8 md:gap-y-10">
                {category.videos.map((video) => (
                  <div
                    key={video.id}
                    className="rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-[#E2E8F0]"
                  >
                    <div className="relative aspect-video ">
                      <a
                        href={`https://www.youtube.com/watch?v=${video?.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block w-full h-full"
                      >
                        <Image
                          src={`https://img.youtube.com/vi/${video?.videoId}/hqdefault.jpg`}
                          alt="Video Thumbnail"
                          fill
                          className="object-cover object-center"
                          unoptimized
                        />
                      </a>
                    </div>

                    <div className="p-4">
                      <h3 className="font-roboto not-italic font-normal text-[15px] md:text-[26px] leading-[18px] md:leading-[32px] tracking-[-0.26px] text-[#0F172A] whitespace-nowrap overflow-hidden text-ellipsis">
                        {t(video.title)}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoTutorials;
