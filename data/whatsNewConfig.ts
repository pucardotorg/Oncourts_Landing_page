export interface WhatsNewItem {
  id: number;
  title: string;
  description: string;
}

export interface WhatsNewSection {
  title: string;
  subTitle: string;
  data: WhatsNewItem[];
}

export const whatsNewData = {
  title: "What's New in 24x7 ON Courts?",
  description:
    "Stay updated with the latest improvements and upcoming features designed to enhance your experience. Explore the latest upgrades in 24x7 ON Court and get a glimpse of what’s coming next!",
  latestUpgrades: {
    title: "Live Now: Latest Upgrades in ON Court",
    subTitle: "Discover the latest features on the 24x7 ON Court platform",
    data: [
      {
        id: 1,
        title: "Easier Bail Applications",
        description:
          "Submit anytime, attach all documents, and include terms & conditions in one go.",
      },
      {
        id: 2,
        title: "Simpler Delay Condonation Requests",
        description:
          "Clear limitation rule making the process easier for advocates.",
      },
      {
        id: 3,
        title: "Better Complaint Documents",
        description: "Duplicate entries in PDFs are now fixed.",
      }
    ],
  },
  upcomingFeatures: {
    title: "Coming Soon: What’s Next?",
    subTitle: "Exciting new features are on the way!",
    data: [
      {
        id: 1,
        title: "Correcting stage labels (cognizance, admission, etc.)",
        description: "",
      },
      {
        id: 2,
        title: "CMP numbers to be attached to each petition",
        description: "",
      },
      {
        id: 3,
        title: "Email OTP to solve for downtime for SMS due to CDAC (vendor)",
        description: "",
      },
    ],
  },
};
