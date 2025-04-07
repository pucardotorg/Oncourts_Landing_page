import Image from "next/image";
import { FooterConfig } from "../data/FooterConfig"; // Ensure path is correct

const Footer: React.FC = () => {
  return (
    <footer
      className="bg-footerBg text-white w-full mt-auto"
      style={{
        padding: "58px 12px",
      }}
    >
      <div
        className="flex flex-col md:flex-row justify-between items-center md:items-start max-w-screen-xl mx-auto"
        style={{ gap: "53.94px" }}
      >
        {/* Left Section: Logo */}
        <div className="flex flex-col items-center md:items-start">
          <Image
            src={FooterConfig.logo.imageUrl}
            alt={FooterConfig.logo.alt}
            width={FooterConfig.logo.width}
            height={FooterConfig.logo.height}
          />
          <p className="text-sm mt-2">{FooterConfig.logo.tagline}</p>
        </div>

        {/* Middle Section: Quick Links & User Terms */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-2">
            Quick Links & User Terms
          </h3>
          <div
            className={`grid ${
              FooterConfig.quickLinks.length > 4
                ? "grid-cols-2 gap-x-20 gap-y-4"
                : "grid-cols-1 gap-y-4"
            }`}
          >
            {FooterConfig.quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="text-sm hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right Section: External Links */}
        <div className="flex flex-col mr-[45px]">
          {" "}
          {/* Updated margin */}
          <h3 className="text-lg font-semibold mb-2">External Links</h3>
          <div
            className={`grid ${
              FooterConfig.externalLinks.length > 4
                ? "grid-cols-2 gap-x-20 gap-y-4"
                : "grid-cols-1 gap-y-4"
            }`}
          >
            {FooterConfig.externalLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="text-sm hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto mt-6">
        <hr className="border-t border-white" />
      </div>

      {/* Copyright Section */}
      <div className="mt-6">
        <div className="text-center text-sm">{FooterConfig.copyright}</div>
      </div>
    </footer>
  );
};

export default Footer;
