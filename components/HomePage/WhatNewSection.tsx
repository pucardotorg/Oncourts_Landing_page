import { whatsNewData } from "../../data/whatsNewConfig";
import { svgIcons } from "../../data/svgIcons";
import Link from "next/link";
import WhatsNewCard from "./WhatsNewCard";

const WhatsNewSection: React.FC = () => {
  return (
    <section className="bg-tealBg py-12 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-teal">
          {whatsNewData.title}
        </h2>
        <p className="mt-4 text-darkGrey text-lg">{whatsNewData.description}</p>
      </div>

      <div className="mt-10 grid gap-12 md:grid-cols-2 max-w-6xl mx-auto">
        {[whatsNewData.latestUpgrades, whatsNewData.upcomingFeatures].map(
          (section, index) => (
            <WhatsNewCard key={index} section={section} />
          )
        )}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/whats-new"
          className="text-teal hover:underline inline-flex items-center space-x-1"
        >
          <span className="text-xl font-semibold">Know more</span>
          <svgIcons.RightArrow />
        </Link>
      </div>
    </section>
  );
};

export default WhatsNewSection;
