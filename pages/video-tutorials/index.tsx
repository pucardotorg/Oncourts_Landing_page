import React from "react";
import Image from "next/image";

interface VideoTutorial {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
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
    title: "General Videos",
    videos: [
      {
        id: "user-registration",
        title: "User Registration & Login",
        thumbnail: "/images/group.png",
        videoUrl:
          "https://www.youtube.com/watch?v=yXaegVWBrK0&ab_channel=LEdINDIA",
        category: "general",
      },
      {
        id: "email-upload",
        title: "E-mail Upload",
        thumbnail: "/images/group.png",
        videoUrl:
          "https://www.youtube.com/watch?v=yXaegVWBrK0&ab_channel=LEdINDIA",
        category: "general",
      },
      {
        id: "submission",
        title: "Submission Extension & Response",
        thumbnail: "/images/group.png",
        videoUrl:
          "https://www.youtube.com/watch?v=yXaegVWBrK0&ab_channel=LEdINDIA",
        category: "general",
      },
      {
        id: "calendar",
        title: "Calendar Management, Scheduling & Rescheduling",
        thumbnail: "/images/group.png",
        videoUrl:
          "https://www.youtube.com/watch?v=yXaegVWBrK0&ab_channel=LEdINDIA",
        category: "general",
      },
      {
        id: "hearing",
        title: "Hearing Management",
        thumbnail: "/images/group.png",
        videoUrl:
          "https://www.youtube.com/watch?v=yXaegVWBrK0&ab_channel=LEdINDIA",
        category: "general",
      },
      {
        id: "order",
        title: "Order & Judgement",
        thumbnail: "/images/group.png",
        videoUrl:
          "https://www.youtube.com/watch?v=yXaegVWBrK0&ab_channel=LEdINDIA",
        category: "general",
      },
    ],
  },
  {
    id: "complainant",
    title: "Complainant Side",
    videos: [
      {
        id: "file-case-complainant",
        title: "File a Case",
        thumbnail: "/images/graph.png",
        videoUrl:
          "https://www.youtube.com/watch?v=yXaegVWBrK0&ab_channel=LEdINDIA",
        category: "complainant",
      },
      {
        id: "defect-correction",
        title: "Defect Correction",
        thumbnail: "/images/graph.png",
        videoUrl:
          "https://www.youtube.com/watch?v=yXaegVWBrK0&ab_channel=LEdINDIA",
        category: "complainant",
      },
      {
        id: "process-management",
        title: "Process Management",
        thumbnail: "/images/graph.png",
        videoUrl:
          "https://www.youtube.com/watch?v=yXaegVWBrK0&ab_channel=LEdINDIA",
        category: "complainant",
      },
      {
        id: "join-case",
        title: "Join a Case",
        thumbnail: "/images/graph.png",
        videoUrl:
          "https://www.youtube.com/watch?v=yXaegVWBrK0&ab_channel=LEdINDIA",
        category: "complainant",
      },
    ],
  },
  {
    id: "accused",
    title: "Accused Side",
    videos: [
      {
        id: "join-case",
        title: "Join a Case",
        thumbnail: "/images/graph.png",
        videoUrl:
          "https://www.youtube.com/watch?v=yXaegVWBrK0&ab_channel=LEdINDIA",
        category: "accused",
      },
      {
        id: "bail",
        title: "Bail",
        thumbnail: "/images/graph.png",
        videoUrl:
          "https://www.youtube.com/watch?v=yXaegVWBrK0&ab_channel=LEdINDIA",
        category: "accused",
      },
    ],
  },
  {
    id: "know-your-case",
    title: "Know your Case",
    videos: [
      {
        id: "download-cause-list",
        title: "Download Cause list",
        thumbnail: "/images/graph.png",
        videoUrl:
          "https://www.youtube.com/watch?v=yXaegVWBrK0&ab_channel=LEdINDIA",
        category: "know-your-case",
      },
      {
        id: "view-display-board",
        title: "View Display Board",
        thumbnail: "/images/graph.png",
        videoUrl:
          "https://www.youtube.com/watch?v=yXaegVWBrK0&ab_channel=LEdINDIA",
        category: "know-your-case",
      },
      {
        id: "case-search",
        title: "Case Search",
        thumbnail: "/images/graph.png",
        videoUrl:
          "https://www.youtube.com/watch?v=yXaegVWBrK0&ab_channel=LEdINDIA",
        category: "know-your-case",
      },
    ],
  },
  {
    id: "screen-walkthrough",
    title: "Screen Walkthrough",
    videos: [
      {
        id: "home-screen",
        title: "Home Screen",
        thumbnail: "/images/graph.png",
        videoUrl:
          "https://www.youtube.com/watch?v=yXaegVWBrK0&ab_channel=LEdINDIA",
        category: "screen-walkthrough",
      },
      {
        id: "view-case",
        title: "View a Case",
        thumbnail: "/images/graph.png",
        videoUrl:
          "https://www.youtube.com/watch?v=yXaegVWBrK0&ab_channel=LEdINDIA",
        category: "screen-walkthrough",
      },
    ],
  },
];

const VideoTutorials: React.FC = () => {
  return (
    <div className="py-8 bg-white">
      <div className="w-[95%] md:w-[90%] mx-auto">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="font-libre not-italic font-normal text-[40px] md:text-[64px] leading-[46px] md:leading-[70px] text-center tracking-[-0.8px] text-[#3A3A3A]">
            Video Tutorials
          </h1>
          <p className="mt-4 font-roboto not-italic font-normal text-[20px] md:text-[28px] leading-[28px] md:leading-[40px] text-center tracking-[-0.56px] text-[#334155]">
            Learn how to navigate ON Court through easy-to-follow instructional
            videos
          </p>
        </div>

        {/* Video Categories */}
        <div className="space-y-12">
          {videoCategories.map((category) => (
            <div key={category.id} className="mb-8">
              <h2 className="font-libre not-italic font-normal text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] text-[#3A3A3A] mb-6 md:mb-8">
                {category.title}
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-x-8 md:gap-y-10">
                {category.videos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-[#F8FAFC] rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                      >
                        <span className="bg-white text-[#3A3A3A] px-4 py-2 rounded-full hover:bg-[#3A3A3A] hover:text-white transition-colors duration-300">
                          Watch Video
                        </span>
                      </a>
                    </div>
                    <div className="p-4">
                      <h3 className="font-roboto not-italic font-normal text-[18px] md:text-[26px] leading-[24px] md:leading-[32px] tracking-[-0.26px] text-[#0F172A]">
                        {video.title}
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
