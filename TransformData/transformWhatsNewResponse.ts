import { WhatsNewItem, WhatsNewSection } from "../data/whatsNewConfig";

export interface MdmsApiResponse {
  MdmsRes: {
    LandingPage: {
      LatestAndComingSoon: WhatsNewItem[];
    };
  };
}

export function transformWhatsNewResponse(data: MdmsApiResponse): {
  latestUpgrades: WhatsNewSection;
  upcomingFeatures: WhatsNewSection;
} {
  const allItems = data?.MdmsRes?.LandingPage?.LatestAndComingSoon || [];

  const liveNowItems = allItems
    ?.filter((item) => item?.itemCategory === "LIVE_NOW")
    ?.sort((a, b) => (Number(a?.itemId) || 0) - (Number(b?.itemId) || 0));

  const comingSoonItems = allItems
    ?.filter((item) => item?.itemCategory === "COMING_SOON")
    ?.sort((a, b) => (Number(a?.itemId) || 0) - (Number(b?.itemId) || 0));

  return {
    latestUpgrades: {
      title: "Live Now: Latest Upgrades in ON Court",
      subTitle: "Discover the latest features on the 24x7 ON Court platform",
      data: liveNowItems,
    },
    upcomingFeatures: {
      title: "Coming Soon: What’s Next?",
      subTitle: "Exciting new features are on the way!",
      data: comingSoonItems,
    },
  };
}
